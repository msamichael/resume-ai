"use client";
import { Briefcase, CheckCircle2, File, Shield, StarsIcon, Upload } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <main className="m-auto p-4">
      <section className="text-center my-12 flex flex-col items-center justify-center">
        {/* Hero Section */}
        <div className="flex gap-2 items-center mb-4 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-full">
          <StarsIcon className="text-teal-700" size={20} />
          <span className="text-teal-700 font-medium ">AI-Powered Resume Optimization</span>
        </div>
        <h1 className="mb-4 text-4xl md:text-5xl font-medium text">Beat the ATS</h1>
        <p className="mb-6 text-slate-400 text-4xl md:text-5xl font-medium text">Improve your resume in minutes.</p>
        <p className="text-slate-500 text-lg max-w-2xl">
          Paste the job description and upload your resume to get your fit score
          instantly.
        </p>

        {/* Form Section */}
        <form action="">
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
                placeholder="Paste the job listing here..."
                className="flex-1 border border-gray-300 rounded-xl resize-none w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  type="file"
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
                    </>
                  )
                 }
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <button className="bg-gray-800 group relative hover:bg-gray-900 cursor-pointer text-white w-fit px-4 py-2 rounded-xl shadow-lg shadow-black/20 hover:shadow-black/40 hover:-translate-y-0.5  hover:text-white transition-colors duration-300">
              Analyze Resume
              {/* Gradient Ov erlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            </button>
          </div>
        </form>
        <p className="text-slate-500 text-sm mt-4"><span><Shield size={16} className="inline mr-1" /></span>No data is stored</p>
      </section>
    </main>
  );
}
