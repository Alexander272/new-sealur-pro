import { FC, SyntheticEvent, useState } from 'react'
import { Autocomplete, Stack, SxProps, TextField, Theme, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/SearchOutlined'

import type { CompanyInfo } from '../types/companies'
import { useDebounce } from '@/hooks/debounce'
import { useFindCompanyQuery } from '../companiesApiSlice'

type Props = {
	value: CompanyInfo | null
	label?: string
	onChange: (value: CompanyInfo | null) => void
	error?: boolean
	sx?: SxProps<Theme>
}

export const Company: FC<Props> = ({ value, onChange, error, label, sx }) => {
	const [company, setCompany] = useState('')
	const debounced = useDebounce(company, 500)

	const { data, isFetching } = useFindCompanyQuery(debounced, { skip: !debounced })

	const companyHandler = (_event: SyntheticEvent, newInputValue: string) => {
		setCompany(newInputValue)
	}
	const selectCompanyHandler = (_event: SyntheticEvent, newValue: CompanyInfo | null) => {
		onChange(newValue)
		if (newValue !== null) setCompany('')
	}

	return (
		<Autocomplete
			value={value}
			getOptionLabel={option => (typeof option === 'string' ? option : option.value)}
			autoComplete
			includeInputInList
			autoSelect
			options={data?.data || []}
			popupIcon={<SearchIcon />}
			onChange={selectCompanyHandler}
			noOptionsText='Ничего не найдено'
			onInputChange={companyHandler}
			loading={isFetching}
			loadingText='Поиск организации...'
			renderInput={params => (
				<TextField
					{...params}
					label={label}
					name='company'
					placeholder='Название организации *'
					size='small'
					autoComplete='off'
					error={error}
					sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10, background: '#fff' }, ...sx }}
				/>
			)}
			renderOption={(props, option) => {
				return (
					<li {...props} key={option.data.hid}>
						<Stack>
							<Typography>{option.value}</Typography>
							<Typography variant='body2' color='text.secondary'>
								{option.data.address.value}
							</Typography>
						</Stack>
					</li>
				)
			}}
			sx={{ '& .MuiAutocomplete-popupIndicator': { transform: 'none' } }}
		/>
	)
}
