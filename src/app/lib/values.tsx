// Date and Time Constants
export const MILLISECPNDS_IN_SECOND = 1000;
export const SECONDS_IN_MINUTE = 60;
export const MINUTES_IN_HOUR = 60;
export const HOURS_IN_DAY = 24;
export const DAYS_IN_MONTH = 30;

export const BULK_COMPANY_STATUSES = [
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "edited", label: "Edited" },
]

export const PROSPECT_VALUES = [
  { value: "pending", label: "Pending" },  // 0
  { value: "prospect", label: "Prospect" },  // 1
  { value: "lead", label: "Lead" },  // 2
  { value: "customerPending", label: "Customer Pending"  },  // 3
  { value: "customer", label: "Customer"  },  // 4
  { value: "promoter", label: "Promoter" },  // 5
  { value: "lost", label: "Lost"  },  // 6
  { value: "mcvpap", label: "Waiting for MCVP Approvel"  },  // 7
  { value : "customerPendingMoURejected", label :"Customer Pending - MoU Rejected" }  // 8
]

export const USER_ROLE_VALUES = [
  { value: "admin", label: "Administrator" },
  { value: "user", label: "User" }
]



export const AUTONOMATION_TABLE_ID = "6769349892a256157cb6142c"

export const PENDING_TIME_DURATION = 1 * DAYS_IN_MONTH * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECPNDS_IN_SECOND // 1 month in milliseconds
export const PROSPECT_EXPIRE_TIME_DURATION = 15 * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECPNDS_IN_SECOND // 15 days in milliseconds
export const LEAD_EXPIRE_TIME_DURATION = 1 * DAYS_IN_MONTH * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECPNDS_IN_SECOND // 1 month in milliseconds
export const PROMOTER_EVENT_EXPIRE_TIME_DURATION = 3 * DAYS_IN_MONTH * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECPNDS_IN_SECOND; // 3 months in milliseconds
export const PROMOTER_PRODUCT_EXPIRE_TIME_DURATION = 6 * DAYS_IN_MONTH * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECPNDS_IN_SECOND; // 6 months in milliseconds
export const QUEUE_TIME_DURATION = 1 * DAYS_IN_MONTH * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECPNDS_IN_SECOND // 1 month in milliseconds


//export const BASE_URL = "http://localhost:3001";



export const PARTNERHSIPS_UI_PATH = "/dashboard/prospect/prospects"


/** Summery Bars */

// Prospect
export const PROSPECT_BAR_COLOR = "yellow"
export const PROSPECT_BAR_WIDTH = "20%"

// Lead
export const LEAD_BAR_COLOR = "blue"
export const LEAD_BAR_WIDTH = "40%"

// Customer Pending
export const CUSTOMER_PANDING_BAR_COLOR = "green"
export const CUSTOMER_PANDING_BAR_WIDTH = "60%"

// Customer
export const CUSTOMER_BAR_COLOR = "indigo"
export const CUSTOMER_BAR_WIDTH = "80%"

// Promoter
export const PROMOTER_BAR_COLOR = "green"
export const PROMOTER_BAR_WIDTH = "100%"

export const  CUSTOMER_PENDING_MOU_REJECTED_BAR_COLOR = "red"
export const  CUSTOMER_PENDING_MOU_REJECTED_BAR_WIDTH = "60%"


export const MAX_PROSPECTS = /*150;*/ 3 // Maximum number of prospects allowed