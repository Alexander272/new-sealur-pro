import { API } from '@/app/api'
import { apiSlice } from '@/app/apiSlice'
import { CompanyInfo } from './types/companies'

const companiesApiSlice = apiSlice.injectEndpoints({
	overrideExisting: false,
	endpoints: builder => ({
		findCompany: builder.query<{ data: CompanyInfo[] }, string>({
			query: data => ({
				url: `${API.companies}/${data}`,
				method: 'GET',
			}),
		}),
	}),
})

export const { useFindCompanyQuery } = companiesApiSlice
