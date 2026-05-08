interface Campaign {
  id: number;
  name: string;
  details: string;
  story: string;
  main_img: string;
  imgs: string;   
  donors: Donor[];
  goal: number;
  raised: number;
  _type: string;
  center_name: string | null;
  center_id: string | null;
  user_id: number;
  date_to_completion: string; 
  created_at: string;
  currency: "NG" | "USD" | "EURO";
  category: "Education" | "Community" | "CroudFunding" | "Business" | "Health";
    donation_count:number,
    bank_details:bankDetails,
    escrowed:number,
    safety_rating:  'verified_safe' |
    'likely_safe' |
    'uncertain' |
    'likely_risky' |
    'unsafe';
}

interface Donor {
  name: string;
  amount: number;
}

interface bankDetails {
    accountName?:string,
    accountNumber?:string,
    bankName?:string,
    bankCode?:string,
    subAccountCode:string,
    email:string
}

interface UserData {
  full_name: string
  email: string
  is_verified: number
  created_at: string
  image: string
  donations: number
  recived: number
  bank_details:bankDetails;
  method:string
}


interface CloudinaryImage {
  url: string
  publicId: string
  isUploading: boolean
  uploadProgress: number
}

interface PaystackBank {
    name: string
    code: string
    slug: string
    longcode: string
    gateway: string | null
    pay_with_bank: boolean
    active: boolean
    is_deleted: boolean
    country: string
    currency: string
    type: string
}

type DocType = "NIN" | "BVN" | "DRIVERS_LICENSE" | "PASSPORT" | "VOTERS_CARD";

interface KycFormData {
  fullName: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  documentType: DocType | "";
  documentNumber: string;
}

export type { Campaign, Donor, UserData , CloudinaryImage , bankDetails, PaystackBank , KycFormData}