import { CalendarEvent, CalendarEventAction} from "angular-calendar";
import { Appointment, AppointmentType, colors, PresetAppointment, PresetAppointmentData } from "../models/appointment";

// export interface myEvents extends CalendarEvent {
//   childId : any;
// }

export function calendarEventFromAppointment(item:Appointment, actions?:CalendarEventAction[]):CalendarEvent{
    let ret_item:CalendarEvent={
      id:item.id,
      start:new Date(item.start),
      end:new Date(item.end),
      title:item.title,
      color:colors[item.color],            
      actions:actions,
      meta: item.type,
      //childId: item.child.id
    }
   // console.log(ret_item);
    return ret_item;
  }

  export function calendarEventFromPresetAppointment(item:PresetAppointmentData, actions?:CalendarEventAction[]):CalendarEvent{
    let ret_item:CalendarEvent={
      id:item.appointment.id,
      start:new Date(item.appointment.startDate),
      end:new Date(item.appointment.endDate),
      title:item.appointment.title,
      color:colors["preset"],            
      actions:actions,
      meta: AppointmentType.PRESET,
      //childId: item.child.id
    }
   // console.log(ret_item);
    return ret_item;
  }