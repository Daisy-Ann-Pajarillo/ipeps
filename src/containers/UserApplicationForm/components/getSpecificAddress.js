import completePHAddressOption from "../../../reusable/constants/completePHAddressOption";

export const getProvinces = () => {
  return Object.keys(completePHAddressOption)
    .map((regionId) =>
      Object.keys(completePHAddressOption[regionId].province_list)
    )
    .flat()
    .map((province) =>
      province.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
    ) // Convert to Title Case
    .sort(); // Sort Alphabetically
};

export const getMunicipalities = (selectedProvince) => {
  if (!selectedProvince) {
    return [];
  }

   const toTitleCase = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const selectedProvinceLower = selectedProvince.toLowerCase();

  const municipalities = Object.values(completePHAddressOption)
    .flatMap((region) => {
      // Find the province case-insensitively
      const provinceKey = Object.keys(region.province_list || {}).find(
        (key) => key.toLowerCase() === selectedProvinceLower
      );

      if (!provinceKey) {
        return [];
      }

      const provinceData = region.province_list[provinceKey];

      return provinceData.municipality_list.map((municipalityObj) => {
        let municipalityName = Object.keys(municipalityObj)[0];

        // Convert to Title Case
        return toTitleCase(municipalityName.toLowerCase());
      });
    })
    .sort((a, b) => a.localeCompare(b)); // Sort alphabetically

  return municipalities.map((municipality) => ({ municipality }));
};

export const getBarangays = (selectedMunicipality) => {
  if (!selectedMunicipality) {
    return [];
  }

  // Convert selected municipality to lowercase for case-insensitive comparison
  const selectedMunicipalityLower = selectedMunicipality.toLowerCase();
  let barangays = [];

  Object.values(completePHAddressOption).forEach((region) => {
    Object.values(region.province_list || {}).forEach((province) => {
      province.municipality_list.forEach((municipalityObj) => {
        const municipalityName = Object.keys(municipalityObj)[0];

        // Case-insensitive comparison
        if (municipalityName.toLowerCase() === selectedMunicipalityLower) {
          barangays = municipalityObj[municipalityName].barangay_list.map(
            (barangay) =>
              barangay
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase()) // Convert to title case
          );
        }
      });
    });
  });

  return barangays;
};
