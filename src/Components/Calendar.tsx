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
import { useDispatch, useSelector } from "react-redux";
import { setSchedule } from "../actions";
import { getOverview, getSchedule } from "../graphql/queries";
import { DbGetMeReturn, DbSchedule, Person, ReduxState } from "../interfaces";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: number;
}

// const resourceMap = [
//   { resourceId: 1, resourceTitle: "Board room" },
//   { resourceId: 2, resourceTitle: "Training room" },
//   { resourceId: 3, resourceTitle: "Meeting room 1" },
//   { resourceId: 4, resourceTitle: "Meeting room 2" },
// ];

const Calendar = () => {
  const dispatch = useDispatch();
  const reduxSchedules = useSelector((state: ReduxState) => state.schedules);
  const [block, setBlock] = useState<number>(60);
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
  const today = new Date();
  return (
    <div>
      A Block is{" "}
      <select onChange={e => setBlock(parseInt(e.target.value))} value={block}>
        <option value="120">Two Hours</option>
        <option value="60">Hour</option>
        <option value="30">Half-Hour</option>
      </select>
      <BigCalendar
        events={events}
        localizer={localizer}
        defaultView={Views.DAY}
        views={["day", "work_week"]}
        step={block}
        defaultDate={new Date(2021, 10, 29)}
        resources={resourceMap}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        min={
          new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8)
        }
      />
    </div>
  );
};

export default Calendar;
