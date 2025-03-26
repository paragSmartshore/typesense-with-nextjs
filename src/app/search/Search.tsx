'use client'
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter'
import { SearchBox, Hits, RefinementList, Configure } from 'react-instantsearch'
import { InstantSearchNext } from 'react-instantsearch-nextjs'
import Image from 'next/image'
import './styles.css'
import { createInstantSearchRouterNext } from 'react-instantsearch-router-nextjs'
import singletonRouter from 'next/router'

const typesenseInstantsearchAdapter = new TypesenseInstantsearchAdapter({
	server: {
		apiKey: 'xyz',
		nodes: [
			{
				host: 'localhost',
				port: 8108,
				protocol: 'http',
			},
		],
	},
	additionalSearchParameters: {
		query_by: 'title,authors',
		// query_by: 'title,publisher',
		query_by_weights: '4,1',
	},
})

const HitComponent = ({ hit }: { hit: any }) => {
	return (
		<div className="p-4 border border-gray-200 rounded-lg shadow-md">
			<h2 className="text-xl font-semibold mb-2">{hit.title}</h2>
			<p className="mb-2">
				<strong>Authors:</strong> {hit.authors.join(', ')}
			</p>
			<p className="mb-2">
				<strong>Average Rating:</strong> {hit.average_rating}
			</p>
			<p className="mb-2">
				<strong>Publication Year:</strong> {hit.publication_year}
			</p>
			<p className="mb-2">
				<strong>Ratings Count:</strong> {hit.ratings_count}
			</p>
			<p className="mb-4">
				<strong>ID:</strong> {hit.id}
			</p>

			{hit.image_url && (
				<Image src={hit.image_url} alt={hit.title} width={200} height={200} className="mb-4 rounded-lg" />
			)}

			{/* Display highlight results, if any */}
			{hit._highlightResult && (
				<div className="mb-4">
					<h3 className="font-semibold mb-1">Highlighted Results:</h3>
					<p>
						<strong>Title:</strong>
						<span
							dangerouslySetInnerHTML={{
								__html: hit._highlightResult.title.value,
							}}
						/>
					</p>
				</div>
			)}

			{/* Display snippet results, if any */}
			{hit._snippetResult && (
				<div className="mb-4">
					<h3 className="font-semibold mb-1">Snippet Results:</h3>
					<p>
						<strong>Title:</strong>
						<span
							dangerouslySetInnerHTML={{
								__html: hit._snippetResult.title.value,
							}}
						/>
					</p>
				</div>
			)}

			{/* Show raw Typesense hit data if needed */}
			{hit._rawTypesenseHit && (
				<div className="mb-4">
					<h3 className="font-semibold mb-1">Raw Typesense Hit:</h3>
					<p>
						<strong>Document Title:</strong>
						{hit._rawTypesenseHit.document.title}
					</p>
				</div>
			)}

			{/* Optionally show text match info */}
			{hit.text_match_info && (
				<div className="mb-4">
					<h3 className="font-semibold mb-1">Text Match Info:</h3>
					<p>
						<strong>Score:</strong> {hit.text_match_info.score}
					</p>
					<p>
						<strong>Tokens Matched:</strong>
						{hit.text_match_info.tokens_matched}
					</p>
				</div>
			)}
		</div>
	)
}

type UiState = {
	query: string
	refinementList?: {
		authors?: string[]
	}
	// Add other fields based on your search setup
}
export default function Search() {
	const routerNext = createInstantSearchRouterNext<UiState>({
		singletonRouter,
		routerOptions: {
			cleanUrlOnDispose: false,
		},
	})

	return (
		<div className="container mx-auto p-4">
			<InstantSearchNext
				indexName="books"
				searchClient={typesenseInstantsearchAdapter.searchClient}
				routing={{ router: routerNext }}
			>
				{/* <Configure hitsPerPage={2} analytics={false} /> */}
				<SearchBox placeholder="Search for books" className="text-center mb-4" />

				<div className="flex">
					<div className="w-1/4 pr-4">
						<RefinementList
							attribute="authors"
							// attribute="publisher"
							limit={5}
							showMore
							className="mb-4"
						/>
					</div>
					<div className="w-3/4">
						<div>
							<Hits hitComponent={HitComponent} className="" />
							{/* <Hits className="" /> */}
						</div>
					</div>
				</div>
			</InstantSearchNext>
		</div>
	)
}
