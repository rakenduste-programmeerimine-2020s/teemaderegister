import React, { PureComponent } from 'react'
import { PropTypes } from 'prop-types'

import { Avatar, Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import noneBack from '../media/background/none-cur-back.svg'
import halfBack from '../media/background/half-cur-back.svg'
import fullBack from '../media/background/full-cur-back.svg'

const { array, object, shape, string } = PropTypes

const propTypes = {
  meta: PropTypes.shape({
    abbreviation: string.isRequired,
    languages: array.isRequired,
    names: object.isRequired,
    representative: shape({
      profile: object.isRequired
    }).isRequired,
    type: string.isRequired
  })
}

class CurriculumMeta extends PureComponent {
  constructor (props) {
    super(props)

    this.colorMap = {
      BA: fullBack,
      MA: halfBack,
      PHD: noneBack
    }

    this.typeMap = {
      BA: 'Bakalaureuseõpe',
      MA: 'Magistriõpe',
      PHD: 'Doktoriõpe'
    }
  }

  render () {
    const {
      meta: {
        abbreviation,
        languages,
        names,
        representative: { profile },
        type
      }
    } = this.props

    const languageList = languages.map(
      (l, i) =>
        l + ((i !== languages.length - 1) & (languages.length > 1) ? '/' : '')
    )

    const metaBackGround = { backgroundImage: `url(${this.colorMap[type]})` }

    return (
      <div className='curriculumMeta width--public-page' style={metaBackGround}>
        <h1>{names.et}</h1>
        <h3>{abbreviation} | {names.en}</h3>
        <h4>{this.typeMap[type]} - {languageList}</h4>
        <div>
          <Tooltip title={'Õppekava kuraator'}>
            <Avatar
              className='curriculumMeta__avatar'
              shape='square'
              size='small'
              icon={<UserOutlined/>}
            />
            <span>{profile.firstName + ' ' + profile.lastName}</span>
          </Tooltip>
        </div>
      </div>
    )
  }
}

CurriculumMeta.propTypes = propTypes

export default CurriculumMeta
