import API from "@aws-amplify/api";
import { graphqlOperation } from "aws-amplify";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setSchedule } from "../actions";
import { getOverview, getSchedule } from "../graphql/queries";
import {
  DbGetMeReturn,
  DbSchedule,
  Person,
  ReduxState,
  Session,
} from "../interfaces";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: number;
}

const Calendar = () => {
  const dispatch = useDispatch();
  const reduxSchedules = useSelector((state: ReduxState) => state.schedules);
  const [block, setBlock] = useState<number>(30);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [event, setEvent] = useState<Session | null>(null);
  useEffect(() => {
    getSchedules();
  }, []);
  const getSchedules = async () => {
    const { data } = (await API.graphql(graphqlOperation(getOverview))) as any;
    console.log({ data });
    // https://stackoverflow.com/questions/9637517/parsing-relaxed-json-without-eval
    var everybodyJson = data.getOverview[0].everybody.replace(
      /(['"])?([a-z0-9A-Z_]+)(['"])?:/g,
      '"$2": '
    );
    const everybody = JSON.parse(everybodyJson) as Person[];
    console.log({ everybody });
    const schedules: DbSchedule[] = [];
    for (let iterator = 0; iterator < everybody.length; iterator++) {
      const getScheduleInput = { sub: everybody[iterator].sub };
      console.log({ getScheduleInput });
      const getScheduleReturn = (await API.graphql(
        graphqlOperation(getSchedule, { getScheduleInput })
      )) as any;
      console.log({ getScheduleReturn });
      const dbSchedules = getScheduleReturn.data.getSchedule as DbGetMeReturn[];
      schedules.push({
        email: everybody[iterator].email,
        sessions: dbSchedules,
      });
    }
    dispatch(setSchedule(schedules));
  };
  let events: CalendarEvent[] = [];
  for (let iterator = 0; iterator < reduxSchedules.length; iterator++) {
    events = events.concat(
      reduxSchedules[iterator].sessions.map(session => ({
        id: session.sessionId,
        title: session.name,
        start: new Date(session.startTime),
        end: new Date(session.startTime + session.duration * 60000),
        resourceId: iterator + 1,
      }))
    );
  }
  const resourceMap = reduxSchedules.map((s, i) => ({
    resourceId: i + 1,
    resourceTitle: s.email,
  }));
  const showEvent = (event: CalendarEvent) => {
    console.log({ event });
    const dbEvent = reduxSchedules[event.resourceId - 1].sessions.find(
      dbSession => dbSession.sessionId === event.id
    );
    console.log(reduxSchedules[event.resourceId - 1]);
    console.log({ dbEvent });
    setEvent(dbEvent || null);
    setShowModal(true);
  };
  const today = new Date();
  return (
    <div>
      A Block is{" "}
      <select onChange={e => setBlock(parseInt(e.target.value))} value={block}>
        <option value="120">Two Hours</option>
        <option value="60">Hour</option>
        <option value="30">Half-Hour</option>
        <option value="15">15 Minutes</option>
      </select>
      <BigCalendar
        events={events}
        localizer={localizer}
        defaultView={Views.DAY}
        views={["day", "work_week"]}
        step={block}
        defaultDate={today}
        resources={resourceMap}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        onSelectEvent={event => showEvent(event)}
        min={
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8)
        }
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{event?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{event?.room}</p>
          <p>{event?.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar;
