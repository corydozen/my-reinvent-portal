import API from "@aws-amplify/api";
import { graphqlOperation } from "aws-amplify";
import moment from "moment";
import { useEffect } from "react";
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

// const resourceMap = [
//   { resourceId: 1, resourceTitle: "Board room" },
//   { resourceId: 2, resourceTitle: "Training room" },
//   { resourceId: 3, resourceTitle: "Meeting room 1" },
//   { resourceId: 4, resourceTitle: "Meeting room 2" },
// ];

const Calendar = () => {
  const dispatch = useDispatch();
  const reduxSchedules = useSelector((state: ReduxState) => state.schedules);
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
    const schedules: DbSchedule[] = [];
    for (let iterator = 0; iterator < everybody.length; iterator++) {
      const getScheduleReturn = (await API.graphql(
        graphqlOperation(getSchedule, { sub: everybody[iterator].sub })
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
  const sessions = useSelector((state: ReduxState) => state.user.mySessions);
  const events = sessions.map(s => ({
    id: s.sessionId,
    title: s.name,
    start: new Date(s.startTime),
    end: new Date(s.startTime + s.duration * 60000),
    resourceId: 1,
  }));
  // TODO: iterate through schedules and add them to the events array
  const resourceMap = reduxSchedules.map((s, i) => ({
    resourceId: i + 1,
    resourceTitle: s.email,
  }));

  return (
    <div>
      <BigCalendar
        events={events}
        localizer={localizer}
        defaultView={Views.DAY}
        views={["day", "work_week"]}
        step={60}
        defaultDate={new Date(2021, 10, 29)}
        resources={resourceMap}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
      />
    </div>
  );
};

export default Calendar;
