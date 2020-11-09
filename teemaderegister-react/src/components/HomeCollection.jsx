import React from 'react'
import { PropTypes } from 'prop-types'
import HomeCards from './HomeCards'

const { array, arrayOf, shape, string } = PropTypes

const propTypes = {
  curriculums: arrayOf(
    shape({
      collection: array.isRequired,
      type: string.isRequired
    }).isRequired
  )
}

const HomeCollection = props => {
  const { curriculums } = props

  const typeMap = {
    BA: 'Bakalaureuseõpe',
    MA: 'Magistriõpe',
    PHD: 'Doktoriõpe'
  }

  return (
    <div>
      {curriculums.map(single => {
        const { type, collection } = single

        return (
          <div className='homeCollection' key={type}>
            <h1>{typeMap[type]}</h1>
            <HomeCards type={type} collection={collection} />
          </div>
        )
      })}
    </div>
  )
}

HomeCollection.propTypes = propTypes

export default HomeCollection
