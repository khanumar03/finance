"use client"

import { useGetCarbonFootPrint } from '@/features/transactions/api/use-carbon-footprint'
import { useMutualFunds } from '@/features/transactions/api/use-mutual-fund'
import React, { useEffect, useState } from 'react'

const ReportPage = () => {
  const dat = useGetCarbonFootPrint()    
  
    const [report, setReport] = useState<string | undefined>(dat.data)
    
    useEffect(() => {
      setReport(dat.data)  
    },[])

    console.log(report);
    
    
  return (
    <div className='text-white text-xl'>
        {report && report}
    </div>
  )
}

export default ReportPage