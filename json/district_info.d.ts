interface DistrictInfo {
    name: string;
    description: string;
}

interface allDistrictInfos {
    [key: number]: DistrictInfo;
}

declare const allDistrictInfos: allDistrictInfos;
export default allDistrictInfos;