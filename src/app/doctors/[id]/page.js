
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import HeroBanner from "@/components/layout/HeroBanner";
import { ArrowLeft, MapPin, BriefcaseMedical, GraduationCap } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function DoctorProfileContent() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const response = await fetch(`${API_URL}/doctors/${id}`);
        if (!response.ok) throw new Error("Doctor profile could not be found.");
        const result = await response.json();
        setDoctor(result.data || result.doctor || result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDoctor();
  }, [id]);

  if (loading) return <p className="py-16 text-center text-gray-500">Loading profile...</p>;
  if (error || !doctor) return (
    <main className="py-16 text-center">
      <p className="text-red-600">{error || "Doctor not found."}</p>
      <Link href="/" className="mt-4 inline-block text-teal-700">Back to doctors</Link>
    </main>
  );

  const info = [
    ["Hospital", doctor["Working at"]],
    ["Experience", doctor["Exp (In Yrs)"]],
    ["Branch", doctor.Branch],
    ["City", doctor.City],
    ["State", doctor.State],
    ["Registration ID", doctor["Reg. ID"]],
    ["Last Verified", doctor["Last Verified"]],
  ].filter(([, value]) => value && value !== "NA");

  return (
    <main className="min-h-screen bg-white">
      <HeroBanner />

      <section className="mx-auto max-w-5xl px-6 py-8">
        <Link href="/" className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-700">
          <ArrowLeft size={16} /> Back to doctors
        </Link>

        <div className="mb-5">
          <span className="rounded-md bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            {doctor.Speciality || "Speciality not available"}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
            {doctor["Doctor Name"]}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {doctor.Designation || "Designation not available"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                <BriefcaseMedical size={18} className="text-teal-700" />
                Professional Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {info.slice(0, 3).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                <GraduationCap size={19} className="text-teal-700" />
                Educational Qualifications
              </h2>
              <p className="whitespace-pre-line text-sm leading-6 text-gray-600">
                {doctor["Educational Qualification"] || "Not available"}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
              <MapPin size={18} className="text-teal-700" />
              Location & Verification
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {info.slice(3).map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function DoctorProfilePage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-gray-500">Loading profile...</p>}>
      <DoctorProfileContent />
    </Suspense>
  );
}
