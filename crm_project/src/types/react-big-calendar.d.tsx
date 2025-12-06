declare module "react-big-calendar" {
    import { ComponentType } from "react";
  
    export interface Event {
      title: string;
      start: Date;
      end: Date;
      allDay?: boolean;
      resource?: any;
    }
  
    export interface CalendarProps {
      localizer: any;
      events: Event[];
      startAccessor: string | ((event: Event) => Date);
      endAccessor: string | ((event: Event) => Date);
      style?: React.CSSProperties;
      views?: any;
      defaultView?: string;
      onSelectEvent?: (event: Event) => void;
      onSelectSlot?: (slotInfo: any) => void;
    }
  
    export const Calendar: ComponentType<CalendarProps>;
    export const dateFnsLocalizer: any;
  }
  