import React from 'react'
import { PropTypes } from 'prop-types'
import { Col, Card, Row, Collapse } from 'antd'
import { Link } from 'react-router-dom'

import noneBack from '../media/background/none-home-back.svg'
import halfBack from '../media/background/half-home-back.svg'
import fullBack from '../media/background/full-home-back.svg'

const { array, arrayOf, shape, string } = PropTypes

const Panel = Collapse.Panel

const propTypes = {
  collection: arrayOf(
    PropTypes.shape({
      _id: string.isRequired,
      abbreviation: string.isRequired,
      languages: array.isRequired,
      names: shape({
        et: string.isRequired
      }).isRequired,
      slugs: shape({
        et: string.isRequired
      }).isRequired
    }).isRequired
  ).isRequired,
  type: string.isRequired
}

const HomeCards = props => {
  const { type, collection } = props

  const colorMap = {
    BA: fullBack,
    MA: halfBack,
    PHD: noneBack
  }

  let items = {
    available: [],
    closed: []
  }

  collection.forEach((c, i) => {
    const { abbreviation, names, slugs, _id, languages, closed } = c
    const cardBackground = { backgroundImage: 'url(' + colorMap[type] + ')' }
    const languageList = languages.map(
      (l, i) =>
        l + ((i !== languages.length - 1) & (languages.length > 1) ? '/' : '')
    )
    const place = closed ? 'closed' : 'available'

    items[place].push(
      <Col key={i} sm={12} md={8}>
        <Link to={'/curriculum/s/' + slugs.et}>
          <Card
            key={_id}
            className='homeCards__card'
            style={cardBackground}
            bordered
          >
            <h2>
              {names.et}
            </h2>
            <p>
              {abbreviation} | {languageList} { closed && <span>| <b>Suletud</b> </span> }
            </p>
          </Card>
        </Link>
      </Col>
    )
  })

  return (
    <div className='homeCards'>
      <Row gutter={24}>
        {items.available}
      </Row>
      {items.closed.length !== 0 &&
        <Collapse className='homeCards__dropdown' bordered={false}>
          <Panel className='homeCards__closed' header='Suletud' key='1'>
            <Row gutter={24}>
              {items.closed}
            </Row>
          </Panel>
        </Collapse>
      }
    </div>
  )
}

HomeCards.propTypes = propTypes

export default HomeCards
