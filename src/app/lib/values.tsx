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
]

export const PROSPECT_EXPIRE_TIME_DURATION = 1000 * 60 * 60 * 24 * 14
export const LEAD_EXPIRE_TIME_DURATION = 1000 * 60 * 60 * 24 * 30

export const BASE_URL = "http://localhost:3000";



export const PARTNERHSIPS_UI_PATH = "/dashboard/prospect/prospects"