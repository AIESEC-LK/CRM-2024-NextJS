export const BULK_COMPANY_STATUSES = [
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "edited", label: "Edited" },
]

export const PROSPECT_VALUES = [
  { value: "prospect", label: "Prospect" },
  { value: "pending", label: "Pending" },
  { value: "lead", label: "Lead" },
  { value: "promoter", label: "Promoter" },
  { value: "lost", label: "Lost" },
  { value: "customer", label: "Customer" },
  { value: "customerPending", label: "Customer Pending" },
]

export const AUTONOMATION_TABLE_ID = "6769349892a256157cb6142c"

export const PROSPECT_EXPIRE_TIME_DURATION = 1000 * 60 * 60 * 24 * 14
export const LEAD_EXPIRE_TIME_DURATION = 1000 * 60 * 60 * 24 * 30

export const BASE_URL = "http://localhost:3000";



export const PARTNERHSIPS_UI_PATH = "/dashboard/prospect/prospects"


/** Summery Bars */

// Prospect

export const PROSPECT_BAR_COLOR = "yellow"
export const PROSPECT_BAR_WIDTH = "20%"

export const LEAD_BAR_COLOR = "yellow"
export const LEAD_BAR_WIDTH = "40%"

export const CUSTOMER_PANDING_BAR_COLOR = "blue"
export const CUSTOMER_PANDING_BAR_WIDTH = "60%"

export const CUSTOMER_BAR_COLOR = "indigo"
export const CUSTOMER_BAR_WIDTH = "80%"

export const PROMOTER_BAR_COLOR = "red"
export const PROMOTER_BAR_WIDTH = "100%"