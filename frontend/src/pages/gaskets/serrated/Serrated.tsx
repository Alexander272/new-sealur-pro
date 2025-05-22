import { Content, PageTitle } from '@/features/gaskets/components/Skeletons/gasket.style'
import { Main } from '@/features/gaskets/modules/serrated/components/Main/Main'
import { Size } from '@/features/gaskets/modules/serrated/components/Size/Size'

export default function Serrated() {
	return (
		<>
			<PageTitle>Прокладки на металлическом зубчатом основании</PageTitle>
			<Content>
				<Main />
				{/* <Materials />*/}
				<Size />
				{/* <Design />
				<Result /> */}
			</Content>
		</>
	)
}
