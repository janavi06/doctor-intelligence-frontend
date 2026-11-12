
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    MapPin,
    BriefcaseMedical,
    GraduationCap,
} from "lucide-react";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DoctorDirectory() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [city, setCity] = useState("");
    const [hospital, setHospital] = useState("");

    // Fetch doctors from backend
   
useEffect(() => {
    async function fetchDoctors(initial = false) {
        try {
            const response = await fetch(`${API_URL}/doctors`);

            if (!response.ok) {
                throw new Error("Unable to fetch doctors.");
            }

            const result = await response.json();
            setDoctors(result.data || []);
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            if (initial) setLoading(false);
        }
    }

    fetchDoctors(true);

    const interval = setInterval(() => {
        fetchDoctors();
    }, 60000);

    return () => clearInterval(interval);
}, []);


    // Get unique filter options from doctor data
    const specialities = useMemo(
        () =>
            [...new Set(doctors.map((d) => d.Speciality).filter(Boolean))].sort(),
        [doctors]
    );

    const cities = useMemo(
        () =>
            [...new Set(doctors.map((d) => d.City).filter(Boolean))].sort(),
        [doctors]
    );

    const hospitals = useMemo(
        () =>
            [...new Set(doctors.map((d) => d["Working at"]).filter(Boolean))].sort(),
        [doctors]
    );

    // Apply search and all filters
    const filteredDoctors = useMemo(() => {
        return doctors.filter((doctor) => {
            const searchText = search.trim().toLowerCase();

            const matchesSearch =
                !searchText ||
                [
                    doctor["Doctor Name"],
                    doctor.Designation,
                    doctor.Speciality,
                    doctor["Working at"],
                    doctor.City,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value).toLowerCase().includes(searchText)
                    );

            const matchesSpeciality =
                !speciality || doctor.Speciality === speciality;

            const matchesCity =
                !city || doctor.City === city;

            const matchesHospital =
                !hospital || doctor["Working at"] === hospital;

            return (
                matchesSearch &&
                matchesSpeciality &&
                matchesCity &&
                matchesHospital
            );
        });
    }, [doctors, search, speciality, city, hospital]);

    // Clear all search and filter values
    function clearFilters() {
        setSearch("");
        setSpeciality("");
        setCity("");
        setHospital("");
    }

    return (
        <section id="doctors" className="bg-gray-50 px-6 py-12">
            <div className="mx-auto max-w-7xl">

                {/* Directory Heading */}

                {/* <div className="mb-7">
                    <h2 className="font-serif text-3xl font-normal italic text-teal-800 md:text-4xl">
                        Doctor Directory
                    </h2>
                </div> */}


                {/* Search and Filters */}
                <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-center">

                    {/* Search */}
                    <div className="flex min-w-0 items-center rounded-lg border border-black-50 bg-white px-3 lg:flex-1">
                        <Search size={18} className="shrink-0 text-gray-400" />

                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by doctor name or speciality..."
                            className="w-full px-3 py-3 text-sm outline-none"
                        />
                    </div>

                    {/* Speciality Filter */}
                    <select
                        value={speciality}
                        onChange={(e) => setSpeciality(e.target.value)}
                        className="w-full rounded-lg border border-black-150 bg-white px-3 py-3 text-sm outline-none focus:border-teal-600 lg:w-48"
                    >
                        <option value="">All Specialities</option>

                        {specialities.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    {/* City Filter */}
                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-lg border border-black-150 bg-white px-3 py-3 text-sm outline-none focus:border-teal-600 lg:w-40"
                    >
                        <option value="">All Cities</option>

                        {cities.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    {/* Hospital Filter */}
                    <select
                        value={hospital}
                        onChange={(e) => setHospital(e.target.value)}
                        className="w-full rounded-lg border border-black-150 bg-white px-3 py-3 text-sm outline-none focus:border-teal-600 lg:w-48"
                    >
                        <option value="">All Hospitals</option>

                        {hospitals.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    {/* Clear Filters */}
                    <button
                        onClick={clearFilters}
                        className="whitespace-nowrap rounded-lg px-3 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                    >
                        Clear all
                    </button>
                </div>

                {/* Results Count */}
                <div className="mb-5">
                    <p className="text-sm text-gray-600">
                        Showing{" "}
                        <strong className="text-gray-900">
                            {filteredDoctors.length}
                        </strong>{" "}
                        of {doctors.length} doctors
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <p className="py-16 text-center text-gray-500">
                        Loading doctors...
                    </p>
                )}

                {/* Error */}
                {error && (
                    <p className="rounded-lg bg-red-50 p-5 text-sm text-red-700">
                        {error} Check whether your backend server is running.
                    </p>
                )}

                {/* Empty Results */}
                {!loading && !error && filteredDoctors.length === 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                        <p className="font-semibold text-gray-800">
                            No doctors found
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Try changing your search or filters.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="mt-4 text-sm font-semibold text-teal-700 hover:text-teal-900"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {/* Doctor Cards */}
                {!loading && !error && filteredDoctors.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredDoctors.map((doctor) => (
                            <article
                                key={doctor.doctor_id}
                                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:border-teal-200 hover:shadow-md"
                            >
                                <div>
                                    <span className="inline-block rounded-md bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                                        {doctor.Speciality || "Speciality not available"}
                                    </span>

                                    <h3 className="mt-4 text-lg font-bold text-black-900">
                                        {doctor["Doctor Name"]}
                                    </h3>

                                    <p className="mt-1 text-sm text-black-600">
                                        {doctor.Designation}
                                    </p>

                                    <div className="mt-5 space-y-3 text-sm text-black-600">

                                        <div className="flex items-start gap-2">
                                            <BriefcaseMedical
                                                size={17}
                                                className="mt-0.5 shrink-0 text-teal-700"
                                            />
                                            <span>
                                                {doctor["Working at"] || "Not available"}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <MapPin
                                                size={17}
                                                className="mt-0.5 shrink-0 text-teal-700"
                                            />
                                            <span>
                                                {[
                                                    doctor.City,
                                                    doctor.State,
                                                ].filter(Boolean).join(", ") || "Location not available"}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <GraduationCap
                                                size={17}
                                                className="mt-0.5 shrink-0 text-teal-700"
                                            />
                                            <span className="line-clamp-3 whitespace-pre-line">
                                                {doctor["Educational Qualification"] ||
                                                    "Qualification not available"}
                                            </span>
                                        </div>

                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="mt-auto border-t border-gray-100 pt-4">
                                    <p className="mb-4 text-sm text-gray-600">
                                        Experience:{" "}
                                        <strong className="text-gray-900">
                                            {doctor["Exp (In Yrs)"] || "Not available"}
                                        </strong>
                                    </p>

                                    <Link
                                        href={`/doctors/${doctor.doctor_id}`}
                                        className="block rounded-lg bg-teal-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-800"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}
