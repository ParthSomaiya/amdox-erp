import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function EmployeeProfile() {

  const [profile, setProfile] =
    useState({});

  useEffect(() => {

    API.get("/users/me")
      .then((res) =>
        setProfile(res.data)
      );

  }, []);

  return (

    <MainLayout>

      <div className="bg-white shadow rounded p-6">

        <h2 className="text-2xl font-bold mb-4">
          Employee Profile
        </h2>

        <p>Name: {profile.name}</p>

        <p>Email: {profile.email}</p>

        <p>Role: {profile.role}</p>

      </div>

    </MainLayout>

  );

}