"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, User, CreditCard, FileText, Check, AlertCircle, X, Loader2 } from "lucide-react";
import NavBar from "@/app/components/layout/NavBar";
import { uploadImage } from "@/app/lib/upload";
import { KycFormData } from "@/app/lib/types";
import { useSession } from "next-auth/react";
import { FetchProfile, UploadKyc } from "@/app/lib/fetchRequests";
import { useSearchParams } from "next/navigation";
import { DualRingSpinner } from "@/app/components/ui/loading";
import Button from "@/app/components/ui/button";
import Footer from "@/app/components/layout/footer";



const documentTypes: { value: KycFormData["documentType"]; label: string; maxLength: number; placeholder: string }[] = [
  { value: "NIN", label: "National ID (NIN)", maxLength: 11, placeholder: "12345678901" },
  { value: "BVN", label: "Bank Verification Number (BVN)", maxLength: 11, placeholder: "12345678901" },
  { value: "DRIVERS_LICENSE", label: "Driver's License", maxLength: 12, placeholder: "ABC123456789" },
  { value: "PASSPORT", label: "International Passport", maxLength: 9, placeholder: "A12345678" },
  { value: "VOTERS_CARD", label: "Voter's Card", maxLength: 19, placeholder: "1234-5678-9012-3456" },
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
  "Yobe", "Zamfara",
];

export default function KycForm() {
  const [formData, setFormData] = useState<KycFormData>({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    documentType: "",
    documentNumber: "",
  });

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,setError] = useState(false)
  const [loading , setloading] = useState(true)
    const {data:session} = useSession()

  const searchparams = useSearchParams()
  const redirect = searchparams.get("redir")
  const selectedDoc = documentTypes.find((d) => d.value === formData.documentType);

  const handleInputChange = (field: keyof KycFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const fetchData = async()=>{
       setloading(true)
       setError(false)
          try {
              const res = await FetchProfile(session?.user.email as string)
          if(!res.error){
              if(res.kyc){
                  setSubmitted(true)
              }
          }else{
              setError(true)   
          }
          } catch (error) {
            setError(true)
            console.log(error)
          }finally{
             setloading(false)
          }
  }

  useEffect(()=>{
        fetchData()
  },[session])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, documentFile: "File must be under 5MB" }));
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, documentFile: "Only JPG, PNG, or PDF allowed" }));
      return;
    }

    setDocumentFile(file);
    setErrors((prev) => ({ ...prev, documentFile: "" }));
    setUploadedUrl("");

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    setDocumentFile(null);
    setPreviewUrl(null);
    setUploadedUrl("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };

  const handleUploadToCloudinary = async () => {
    if (!documentFile) return;

    setUploading(true);
    setErrors((prev) => ({ ...prev, documentFile: "" }));

    try {
      const uploadForm = new FormData();
      uploadForm.append("file", documentFile);

      const result = await uploadImage(uploadForm);
      setUploadedUrl(result.url);

    } catch (err: any) {
      setErrors((prev) => ({ ...prev, documentFile: err.message || "Upload failed" }));
    } finally {
      setUploading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.phone.trim() || !/^\d{11}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Valid 11-digit phone number required";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.documentType) newErrors.documentType = "Select a document type";
    if (!formData.documentNumber.trim()) newErrors.documentNumber = "Document number is required";
    if (!documentFile) newErrors.documentFile = "Please upload proof of document";
    if (!uploadedUrl) newErrors.documentFile = "Please wait for upload to complete or upload again";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      const payload = {
          email: session?.user.email as string, 
          formData:formData,
          documentUrl: uploadedUrl,
        }
     const res = await UploadKyc(payload)

      if (!res.error) {
        setSubmitted(true);
        console.log("KYC submitted successfully");
        setTimeout(()=>{
            window.location.href = (redirect as string) || "/dashboard/donor?goto=profile"
        },2000)
      } else {
        const err = res
        setErrors((prev) => ({ ...prev, submit: err.error || "Submission failed" }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, submit: "Network error. Try again." }));
    } finally {
      setSubmitting(false);
    }
  };

  if(loading){
     return (
        <>
        <NavBar />
          <div className="min-h-screen bg-white flex items-center justify-center px-4">
            
            <div className="text-center max-w-sm">
              <DualRingSpinner />
              <h2 className="text-xl mt-10 font-bold text-gray-900">Loading...</h2>
            </div>
          </div>
        </>
     )
  }

  if(error){
       return (
        <>
        <NavBar />
          <div className="min-h-screen bg-white flex items-center justify-center px-4">

            <div className="text-center max-w-sm">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900">Error</h2>
              <p className="text-gray-500 text-sm mt-2">
                Unable to load KYC information. Please refresh the page or try again later.
              </p>

              <Button variant="secondary" className="mt-6" onClick={fetchData} details="Retry" />
               
            </div>
          </div>
        </>
       )
  }

  if (submitted) {
    return (
    <>
    <NavBar />
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">KYC Submitted</h2>
          <p className="text-gray-500 text-sm mt-2">
            Your documents are under review. You'll be notified within 24 hours.
          </p>
        </motion.div>
      </div>
    </>
    );
  }

  return (
   <>
     <NavBar />
      <div className="min-h-screen bg-white py-12 px-4">
      
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Identity Verification</h1>
          <p className="text-gray-500 text-sm mt-1">
            Complete your KYC to start raising funds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (as on ID)</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="John Ade Doe"
                className={`w-full h-11 px-4 bg-white border text-black rounded-xl text-sm
                  ${errors.fullName ? "border-red-300" : "border-gray-200"}
                  focus:outline-none focus:border-gray-900`}
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className={`w-full h-11 px-4 bg-white border text-black rounded-xl text-sm
                    ${errors.dateOfBirth ? "border-red-300" : "border-gray-200"}
                    focus:outline-none focus:border-gray-900`}
                />
                {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="08012345678"
                  className={`w-full h-11 px-4 text-black bg-white border rounded-xl text-sm
                    ${errors.phone ? "border-red-300" : "border-gray-200"}
                    focus:outline-none focus:border-gray-900`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Address
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="12 Lagos Street"
                className={`w-full h-11 px-4 text-black bg-white border rounded-xl text-sm
                  ${errors.address ? "border-red-300" : "border-gray-200"}
                  focus:outline-none focus:border-gray-900`}
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Ikeja"
                  className={`w-full h-11 text-black px-4 bg-white border rounded-xl text-sm
                    ${errors.city ? "border-red-300" : "border-gray-200"}
                    focus:outline-none focus:border-gray-900`}
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className={`w-full h-11 px-4 text-black bg-white border rounded-xl text-sm
                    ${errors.state ? "border-red-300" : "border-gray-200"}
                    focus:outline-none focus:border-gray-900`}
                >
                  <option value="">Select state</option>
                  {nigerianStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>
            </div>
          </div>

          {/* Document */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Identity Document
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <div className="grid grid-cols-2 gap-2">
                {documentTypes.map((doc) => (
                  <button
                    key={doc.value}
                    type="button"
                    onClick={() => {
                      handleInputChange("documentType", doc.value);
                      handleInputChange("documentNumber", "");
                    }}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all
                      ${formData.documentType === doc.value
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {doc.label}
                  </button>
                ))}
              </div>
              {errors.documentType && <p className="text-xs text-red-500 mt-1">{errors.documentType}</p>}
            </div>

            <AnimatePresence>
              {selectedDoc && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {selectedDoc.label} Number
                  </label>
                  <input
                    type="text"
                    value={formData.documentNumber}
                    onChange={(e) => handleInputChange("documentNumber", e.target.value.toUpperCase().slice(0, selectedDoc.maxLength))}
                    placeholder={selectedDoc.placeholder}
                    maxLength={selectedDoc.maxLength}
                    className={`w-full h-11 px-4 text-black bg-white border rounded-xl text-sm font-mono tracking-wider
                      ${errors.documentNumber ? "border-red-300" : "border-gray-200"}
                      focus:outline-none focus:border-gray-900`}
                  />
                  {errors.documentNumber && (
                    <p className="text-xs text-red-500 mt-1">{errors.documentNumber}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
              
              {!documentFile ? (
                <label className={`block w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                  ${errors.documentFile ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400 bg-white"}`}>
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, or PDF up to 5MB</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-3">
                  <div className="relative bg-white border border-gray-200 rounded-xl p-4">
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                    <div className="flex items-center gap-3">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{documentFile.name}</p>
                        <p className="text-xs text-gray-500">{(documentFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  </div>

                  {!uploadedUrl && (
                    <button
                      type="button"
                      onClick={handleUploadToCloudinary}
                      disabled={uploading}
                      className="w-full h-10 bg-gray-900 text-white rounded-lg text-sm font-medium
                        hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed
                        transition-colors flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload document
                        </>
                      )}
                    </button>
                  )}

                  {uploadedUrl && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                      <Check className="w-4 h-4" />
                      Uploaded successfully
                    </div>
                  )}
                </div>
              )}
              {errors.documentFile && <p className="text-xs text-red-500 mt-1">{errors.documentFile}</p>}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4" />
              {errors.submit}
              <Footer />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || uploading || !uploadedUrl}
            className="w-full h-12 bg-gray-900 text-white rounded-xl font-medium
              hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed
              transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit KYC
                <Check className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
    <Footer />
   </>
  );
}