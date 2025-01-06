export const BULK_COMPANY_STATUSES = [
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "edited", label: "Edited" },
]

export const PROSPECT_VALUES = [
  { value: "pending", label: "Pending" },
  { value: "prospect", label: "Prospect" },
  { value: "lead", label: "Lead" },
  { value: "customerPending", label: "Customer Pending" },
  { value: "customer", label: "Customer" },
  { value: "promoter", label: "Promoter" },
  { value: "lost", label: "Lost" },
  { value: "mcvpap", label: "Waiting for MCVP Approvel" },
  {value : "customerPendingMoURejected", label :"Customer Pending - MoU Rejected"}
]

export const USER_ROLE_VALUES = [
  { value: "admin", label: "Administrator" },
  { value: "user", label: "User" }
]


export const AUTONOMATION_TABLE_ID = "6769349892a256157cb6142c"

export const PROSPECT_EXPIRE_TIME_DURATION = 1000 * 60 * 60 * 24 * 14
export const LEAD_EXPIRE_TIME_DURATION = 1000 * 60 * 60 * 24 * 30

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