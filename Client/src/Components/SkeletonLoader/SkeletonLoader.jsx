import React from 'react'
import "./skeletonLoader.scss"
import { Skeleton } from '@mui/material'

const SkeletonLoader = ({type}) => {
  let width
  let height
 switch (type) {
  case 'list':
    width="100%"
    height=150
    break;
  case 'movie':
    width=270
    height=150
    break;
 }
 return (
    <Skeleton sx={{bgcolor:'grey'}} variant='rectangular'animation='pulse' width={width} height={height}/>
 )
}

export default SkeletonLoader
