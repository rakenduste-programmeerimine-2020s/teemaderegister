import React, { PureComponent } from 'react'
import { PropTypes } from 'prop-types'
import { Row, Col, Popover, Card } from 'antd'
import { ResponsiveContainer, Tooltip, AreaChart, PieChart, Area, Pie, XAxis, Cell, Legend } from 'recharts'
import { InfoCircleOutlined } from '@ant-design/icons'
const { object, shape, string } = PropTypes

const propTypes = {
  count: shape({
    registered: object.isRequired,
    defended: object.isRequired
  }).isRequired,
  data: shape({
    profile: shape({
      firstName: string,
      lastName: string
    }).isRequired
  }).isRequired
}

class SupervisorMeta extends PureComponent {
  UNSAFE_componentWillMount () {
    this.curriculumsChartColors = []
    const abbreviations = Object.keys(this.props.count.abbreviations.chartData)
    const mainRGB = '107,202,186'
    abbreviations.map((key, index) => {
      const opacity = 1 - (1 / abbreviations.length * index)
      this.curriculumsChartColors.push(`rgba(${mainRGB}, ${opacity})`)
    })
  }

  renderTooltip (data) {
    if (!data.payload || !data.payload[0]) return null
    const { name, counts } = data.payload[0].payload
    const { all, types } = counts

    return (
      // Show only if not empty
      <div className='chart-tooltip'>
        <h4>
          {name} õa kokku {all}
        </h4>
        {Object.keys(types).map(key => {
          const t = types[key]
          return (
            <p key={key}>
              {key}: {t}
            </p>
          )
        })}
      </div>
    )
  }

  renderPopover (types) {
    return (
      <div>
        {Object.keys(types).map(key => {
          return (
            <p key={key}>
              {key}: {types[key]}
            </p>
          )
        })}
      </div>
    )
  }

  render () {
    const {
      count: {
        registered,
        defended,
        abbreviations
      },
      data: {
        profile: {
          firstName,
          lastName
        }
      }
    } = this.props

    const name = `${firstName} ${lastName}`
    const imgSrc = `http://via.placeholder.com/150/b1e3da/ffffff/?text=${firstName[0]} ${lastName[0]}`

    return (
      <div className='supervisorMeta width--public-page'>
        <Row className='supervisorMeta__row' gutter={24} type='flex'>

          <Col sm={13} md={12} className='profile'>
            <img className='profile__image' src={imgSrc} />
            <div className='profile__details'>
              <h1>{name}</h1>
              <h3>Tarkvaratehnika õpetaja</h3>
              <h3>Tallinna Ülikool | A-431</h3>
              <div className='profile__details__scontact'>
                E-mail: romil.robtsenkov@romil.ee<br />
                Phone: 6555524 <br />
                Links: <a href='github.com'>Github</a>,{' '}
                <a href='github.com'>ETIS</a>
              </div>
            </div>
          </Col>

          <Col
            className='topics-description'
            xs={24}
            sm={{ span: 10, offset: 1 }}
            md={{ span: 11, offset: 1 }}
          >
            <h4>Topics</h4>
            <div>
              Tallinna Ülikooli vilistlane, kes on lõpetanud nii Informaatika
              eriala bakalaureuse tasemel kui ka läbinud magistriõppe. Õppejõuna
              üritab ta pidevalt ennast täiendada ning kasutada uusi
              tehnoloogiaid, rõhudes alati praktilise lõppväljundi
            </div>
          </Col>
        </Row>

        <div className='supervisorMeta__chart'>

          <Row>
            <Col xs={12} sm={4} md={3}>
              <Card className='card card--supervising'>
                <span className='card__title'>
                  Supervising <br /> today
                </span>

                <span className='card__count'>
                  <Popover
                    content={this.renderPopover(registered.types)}
                    placement='right'
                  >
                    {registered.all}
                    <InfoCircleOutlined className='card__count__icon' />
                  </Popover>
                </span>
                <br />
              </Card>
            </Col>
            <Col xs={12} sm={4} md={3}>
              <Card className='card card--supervised'>
                <span className='card__title'>
                  Total <br />supervised
                </span>
                <span className='card__count'>
                  <Popover
                    content={this.renderPopover(defended.types)}
                    placement='right'
                  >
                    {defended.all}
                    <InfoCircleOutlined className='card__count__icon'/>
                  </Popover>
                </span>
                <br />
              </Card>
            </Col>
            <Col xs={24} sm={8} md={12}>
              <Card className='card card--chart'>
                <ResponsiveContainer height={103}>
                  <AreaChart
                    data={defended.chartData}
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                  >
                    <defs>
                      <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
                        <stop
                          offset='05%'
                          stopColor='rgb(107,202,186)'
                          stopOpacity={0.8}
                        />
                        <stop
                          offset='95%'
                          stopColor='rgb(107,202,186)'
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      content={this.renderTooltip}
                      cursor={false}
                      active
                    />
                    <Area
                      type='monotone'
                      dataKey='counts.all'
                      stroke='rgb(107,202,186)'
                      fillOpacity={1}
                      fill='url(#colorPv)'
                      animationDuration={500}
                      animationEasing='ease-out'
                    />
                    <XAxis
                      dataKey='name'
                      tickSize={8}
                      tickLine={false}
                      axisLine={false}
                      tick={{ color: '#6BCABA' }}
                    />
                  </AreaChart>

                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Card className='card card--curriculums'>
                <ResponsiveContainer height={118}>
                  <Row>
                    <Col xs={{span: 16, offset: 3}} sm={{span: 24, offset: 0}}>
                      <PieChart width={235} height={118} className='pie-chart'>
                        <Pie
                          startAngle={90}
                          endAngle={-360}
                          data={abbreviations.chartData}
                          dataKey='counts'
                          cx={70}
                          cy={55}
                          innerRadius={25}
                          outerRadius={50}
                          animationDuration={500}
                          animationEasing='ease-out'
                        >
                          { abbreviations.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={this.curriculumsChartColors[index]}/>
                          )) }
                        </Pie>
                        <Legend layout='vertical' verticalAlign='middle' align='right' />
                        <Tooltip/>
                      </PieChart>
                    </Col>
                  </Row>

                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

        </div>
      </div>
    )
  }
}

SupervisorMeta.propTypes = propTypes

export default SupervisorMeta
