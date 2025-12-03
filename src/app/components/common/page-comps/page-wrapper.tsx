import React from 'react'

function Pagewrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className='bg-white shadow rounded p-1 gap-1 w-full flex flex-col'>
			{children}
		</div>
	)
}

export default Pagewrapper
