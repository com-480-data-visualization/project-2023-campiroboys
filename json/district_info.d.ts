interface DistrictInfo {
    name: string;
    description: string;
}

interface allDistrictInfos {
    [key: number]: DistrictInfo;
}

export default allDistrictInfos;