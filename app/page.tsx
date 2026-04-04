"use client";
import { Briefcase, CheckCircle2, File, Shield, StarsIcon, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const router = useRouter();

  const fetchResults = async () => {
      if (!selectedFile || !jobDescription.trim()) return;

      setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("job_description", jobDescription);
        formData.append("resume", selectedFile);
        const response = await fetch("/api/analyze", 
        { method: "POST" ,
        body: formData
        });   
      if (!response.ok) {  
        const text = await response.text();
  throw new Error(`HTTP error! status: ${response.status} - ${text}`);}

      const data = await response.json();
      sessionStorage.setItem("analysisResult", JSON.stringify(data));

      router.push("/analyze");


      console.log("Analysis results:", data);
    }  catch (error) {     
       console.error("Error fetching analysis results:", error);
    } finally {
      
    setIsLoading(false);
    }

  };   


  return (
    <main className="m-auto p-4">
      <section className="text-center my-12 flex flex-col items-center justify-center">
        {/* Hero Section */}
        <div className="flex gap-2 items-center mb-4 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-full">
          <StarsIcon className="text-teal-700" size={20} />
          <span className="text-teal-700 font-medium ">AI-Powered Resume Optimization</span>
        </div>
        <h1 className="mb-4 text-4xl md:text-5xl font-medium text"><span className="font-newsreader text-teal-700 animate-fade-in-up3 ">Stronger</span> Job Match </h1>
        <p className="mb-6 text-slate-400 text-4xl md:text-5xl font-medium text">Improve your resume in minutes.</p>
        <p className="text-slate-500 text-lg max-w-2xl">
          Paste the job description and upload your resume to get your fit score
          instantly.
        </p>

        {/* Form Section */}
        <form 
        onSubmit={(e) => {e.preventDefault();
        fetchResults();
        }}
        className="w-full flex items-center justify-center">
          <div className="flex gap-y-20 mt-4 flex-col items-center ">
            {/* Job Description */}
            <div className="flex flex-col items-start gap-2 border border-gray-300 rounded-2xl p-4 w-[80vw] max-w-[900px] h-90 shadow-sm">
              <p className="flex gap-2 items-center text-sm font-semibold text-gray-700">
                <span>
                  <Briefcase size={20} />
                </span>
                Job Description
              </p>
              <textarea
              name="job_description"
                placeholder="Paste the job listing here..."
                className="flex-1 border border-gray-300 rounded-xl resize-none w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Resume Upload */}
            <div className="flex flex-col items-start gap-2 border border-gray-300 rounded-2xl p-4 w-[80vw] max-w-[900px] h-90 shadow-sm">
              <p className="flex gap-2 items-center text-sm font-semibold text-gray-700">
                <span>
                  <File size={20} />
                </span>
                Resume 
              </p>
              <label className="relative w-full h-full border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50/30 rounded-xl bg-slate-200/50 cursor-pointer">
                <input
                name="resume"
                  type="file"
                  accept=".pdf,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500 pointer-events-none">
                 {
                  selectedFile ? (
                    <>
                    <CheckCircle2 className="text-teal-500" size={24}  />
                    <span className="text-sm">{selectedFile.name}</span>
                    </>
                  ):(
                    <>
                    <div className="bg-zinc-100 shadow-sm h-16 w-16 p-0.5 rounded-full flex items-center justify-center"> 

                    <Upload className="h-8 w-8" />
                    </div>
                    <span className="font-medium text-gray-700">Click to upload</span>
                    <p className="text-slate-500 text-xs"> Supports PDF or DOCX</p>
                    </>
                  )
                 }
                </div>
              </label>
            </div>

            {/* Submit Button */}
           <button
  type="submit"
  disabled={isLoading}
  className="bg-gray-800 group relative hover:bg-gray-900 cursor-pointer text-white w-fit px-4 py-2 rounded-xl shadow-lg shadow-black/20 hover:shadow-black/40 hover:-translate-y-0.5 hover:text-white transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
>
  <span className="flex items-center gap-2">
    {isLoading ? (
      
       " Analyzing..."
      
    ) : (
      "Analyze"
    )}
  </span>

  {/* Gradient overlay — hide when loading */}
  {!isLoading && (
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
  )}
</button>
          </div>
        </form>
        <p className="text-slate-500 text-sm mt-4"><span><Shield size={16} className="inline mr-1" /></span>No data is stored</p>
      </section>
    </main>
  );
}
