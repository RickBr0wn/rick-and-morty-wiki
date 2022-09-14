import {
	Button,
	Flex,
	FormControl,
	Grid,
	GridItem,
	Heading,
	Image,
	Input,
	Text,
	useColorMode
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const URL = 'https://rickandmortyapi.com/api/character/'

interface _Info {
	count: number
	next: string
	pages: number
	prev: null
}

interface _Page {
	current: string
	count: number
	next: string
	pages: number
	prev: null
}

interface _Character {
	id: number
	created: string
	episode: string[]
	gender: string
	image: string
	location: {
		name: string
		url: string
	}
	name: string
	origin: {
		name: string
		url: string
	}
	species: string
	status: string
	type: string
	url: string
}

export interface _Data {
	data: {
		info: _Info
		results: _Character[]
	}
}

export const getServerSideProps: GetServerSideProps = async () => {
	const res = await fetch(URL)
	const data: _Data = await res.json()

	return {
		props: { data }
	}
}

const Home = ({ data }: _Data): JSX.Element => {
	const { colorMode } = useColorMode()
	const isDark = colorMode === 'dark'
	const { info, results: defaultResults = [] } = data
	const [results, setResults] = useState(defaultResults)
	const [page, setPage] = useState<_Page>({
		...info,
		current: URL
	})

	const { current } = page

	useEffect(() => {
		if (current === URL) {
			return
		}

		async function fetchData() {
			const res = await fetch(current)
			const nextData = await res.json()

			setPage({ current, ...nextData.info })

			setResults((prev: _Character[]) => [...prev, ...nextData.results])
		}

		fetchData()
	}, [current])

	function loadMoreCharacters() {
		setPage((prev: _Page) => ({
			...prev,
			current: page?.next
		}))
	}

	return (
		<Flex w={'100vw'} justify={'center'}>
			<Flex flexDir={'column'} w={{ base: 500, md: 800, lg: 1040 }} pb={10}>
				<Flex flexDir={'column'} w={'100%'} align={'center'}>
					<Heading fontSize={'4xl'} fontWeight={'black'}>
						Wubba Lubba Dub Dub!
					</Heading>
					<Heading fontSize={'3xl'} fontWeight={'black'}>
						The Rick and Morty Wiki Page
					</Heading>
				</Flex>
				<Flex justify={'center'} w={'100%'}>
					<FormControl maxW={500}>
						<Flex p={4}>
							<Input
								borderColor={'purple.500'}
								color={'purple.500'}
								placeholder={'Search for a character'}
								mr={4}
								fontWeight={'black'}
							/>
							<Button
								fontWeight={'black'}
								colorScheme={'purple'}
								w={40}
								type='submit'
							>
								SEARCH
							</Button>
						</Flex>
					</FormControl>
				</Flex>
				<Grid
					gridTemplateColumns={{
						base: '1fr',
						md: 'repeat(2, 1fr)',
						lg: 'repeat(3, 1fr)'
					}}
					gap={4}
					p={4}
				>
					{results.map((character: _Character) => {
						const { id, name, image } = character
						return (
							<GridItem
								key={id + Math.random()}
								bg={isDark ? 'gray.800' : 'white'}
								borderRadius={'lg'}
								p={4}
								shadow={'lg'}
								marginX={'auto'}
							>
								<Link href={'/'}>
									<Text fontWeight={'black'} fontSize={'lg'}>
										{name}
									</Text>
								</Link>
								<Image src={image} alt={`${name}-thumb`} />
							</GridItem>
						)
					})}
				</Grid>
				<Flex justify={'center'} w={'100%'}>
					<Button marginX={4} onClick={loadMoreCharacters} colorScheme='purple'>
						LOAD MORE
					</Button>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default Home
