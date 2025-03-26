import React, { useState, useEffect } from "react";
import axios from "../../../../../axios";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../../store/actions/index";

const AcademicProfile = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    dispatch(actions.getAuthStorage());
  }, [dispatch]);

  useEffect(() => {
    axios
      .get("api/get-user-info", {
        auth: { username: auth.token }
      })
      .then((response) => {
        setProfileData(response.data.personal_information[0]);
      })
      .catch((error) => {
        console.error("There was an error fetching the profile data!", error);
      });
  }, [auth]);

  const getValue = (value) => (value ? value : "N/A");

  return (
    <div className="p-6 shadow-lg rounded-xl max-w-xl mx-auto mt-6">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">Academic Profile</h2>

      <div className="flex flex-col gap-3 ">
        {profileData ? (
          <>
            <ProfileItem label="First Name" value={profileData?.first_name} />
            <ProfileItem label="Last Name" value={profileData?.last_name} />
            <ProfileItem label="Middle Name" value={profileData?.middle_name} />
            <ProfileItem label="Email" value={profileData?.email} />
            <ProfileItem label="Cellphone Number" value={profileData?.cellphone_number} />
            <ProfileItem label="Landline Number" value={profileData?.landline_number} />
            <ProfileItem label="Employer ID" value={profileData?.employer_id_number} />
            <ProfileItem label="Employer Position" value={profileData?.employer_position} />
            <ProfileItem label="Institution Name" value={profileData?.institution_name} />
            <ProfileItem label="Institution Type" value={profileData?.institution_type} />

            <ProfileItem
              label="Permanent Address"
              value={`${getValue(profileData?.permanent_house_no_street_village)}, ${getValue(
                profileData?.permanent_barangay
              )}, ${getValue(profileData?.permanent_municipality)}, ${getValue(
                profileData?.permanent_province
              )}, ${getValue(profileData?.permanent_country)}`}
            />

            <ProfileItem
              label="Temporary Address"
              value={`${getValue(profileData?.temporary_house_no_street_village)}, ${getValue(
                profileData?.temporary_barangay
              )}, ${getValue(profileData?.temporary_municipality)}, ${getValue(
                profileData?.temporary_province
              )}, ${getValue(profileData?.temporary_country)}`}
            />
          </>
        ) : (
          <p className="col-span-2 text-center text-gray-600">Loading profile data...</p>
        )}
      </div>

      <div className="text-center mt-6">
        <a href="/user-application-form">
          <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
            Edit Profile
          </button>
        </a>
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => {
  return (
    <div className="flex justify-start items-center border-b border-gray-300 dark:border-gray-600 p-3">
      <p className="font-medium text-gray-700 dark:text-gray-300 text-md text-left w-2/5">
        {label}:
      </p>
      <span className="text-gray-600 dark:text-gray-400 text-left w-3/5">
        {value ? value : "N/A"}
      </span>
    </div>

  );
};

export default AcademicProfile;
