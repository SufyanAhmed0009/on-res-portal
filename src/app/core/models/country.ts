export class ModelCountry {
    id?: number;
    code: string;
    country: string;
    timezone?: string;
}

export class SelectorCountry{
    // code: boolean;
    code: string;
    id: number;
    title: string;
    status: string;
}

export class DtFilters {
  countries: number[];
  cities: number[];
  franchises: number[];
}
