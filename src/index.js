import Calendar from "./Calendar";
import EventWrapper from "./EventWrapper";
import BackgroundWrapper from "./BackgroundWrapper";
import { set as setLocalizer } from "./localizer";
import localizer from "./localizers";
import move from "./utils/move";
import { views, navigate } from "./utils/constants";

Object.assign( Calendar, {
    setLocalizer,
    localizer,
    Views: views,
    Navigate: navigate,
    move,
    components: {
        eventWrapper: EventWrapper,
        dayWrapper: BackgroundWrapper,
        dateCellWrapper: BackgroundWrapper,
    }
} );

Calendar.setLocalizer( Calendar.localizer() );

export default Calendar;