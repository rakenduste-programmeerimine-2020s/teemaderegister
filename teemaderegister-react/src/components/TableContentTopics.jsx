import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import queryString from 'query-string'
import reactStringReplace from 'react-string-replace'

import { message, Badge, Tooltip } from 'antd'
// import { Table } from 'antd'
import { DownloadOutlined, StarOutlined, CopyOutlined } from '@ant-design/icons'



export default params => {
  const columns = getColumnNames(params)
  return columns.map(c => {
    return definedColumns[c](params)
  })
}

const typesMap = {
  SE: 'Seminaritöö',
  BA: 'Bakalaureusetöö',
  MA: 'Magistritöö',
  PHD: 'Doktoritöö'
}

const accepted = ({ columnKey, order }) => ({
  title: 'Added',
  className: 'text-align--right',
  dataIndex: 'accepted',
  key: 'accepted',
  render: renderDate,
  sorter: true,
  sortOrder: columnKey === 'accepted' && order
})

const author = ({ columnKey, order, q }) => ({
  title: 'Author',
  dataIndex: 'author',
  key: 'author',
  sortOrder: columnKey === 'author' && order,
  sorter: true,

  // url-ilt saada infot ja selle kaudu saata filtrisse tulemused, mille kaudu filtreerida
  // Console.log-ida kõike võimalikku

  render: author => {
    console.log("render author ColumnKey: ", columnKey);
    if (!author) return '-'

    const fullName = author.firstName + ' ' + author.lastName

    if (q) {
      return reactStringReplace(fullName, q, (match, i) => (
        <span key={i} className='highlight'>{match}</span>
      ))
    }

    return fullName
  }
})

const curriculums = ({ curriculums }) => ({
  className: 'text-align--center',
  filters: [{ text: 'Sobib teistele õppekavadele', value: 'others' }],
  filterMultiple: false,
  title: (
    <Tooltip placement='top' title={'Sobib teistele õppekavadele'}>
      {'ÕK'}
    </Tooltip>
  ),
  dataIndex: 'curriculums',
  key: 'curriculums',
  filteredValue: curriculums || null,
  render: curriculums => {
    console.log("C curriculums: ", curriculums);
    console.log("C columnKey: ", columnKey);
    console.log("C curriculums.abbreviation: ", curriculums.abbreviation);
    let content = null
    if (curriculums.length > 1) {
      content = <Badge
        className='no-status-margin'
        status='default'
      />
    }
    return content
  }
})

const defended = ({ columnKey, order }) => ({
  title: 'Defended',
  className: 'text-align--right',
  dataIndex: 'defended',
  key: 'defended',
  render: renderDate,
  sorter: true,
  sortOrder: columnKey === 'defended' && order
})

// console.log("curriculums.length: ", curriculums.length);
// console.log("curriculums.map(c): ", curriculums.map(c));
// console.log("curriculums.map(i): ", curriculums.map(i));
// console.log("curriculums.length: ", curriculums.length);
// console.log("curriculums.length: ", curriculums.length);

const detailCurriculums = () => ({
  className: 'text-align--left',
  dataIndex: 'curriculums',
  key: 'curriculums',
  title: 'Curriculum',

      // https://ant.design/components/table/#components-table-demo-head
      // headerwrap --- handlesearch + otsing ja url-muutus
      // tablecontenttopics --- luuakse tabel + filter
      // tablewrap --- loetakse väärtus sisse + console.log(filters);

  filters: [
    {
      text: ('IFITM'),
      // value: ('597849cd0d77d8435fdf65d4'),
      value: ('IFITM'),
    },
    {
      text: 'IFIFB',
      // value: '597849cd0d77d8435fdf65d1',
      value: 'IFIFB',
    },
    {
      text: 'DTLGM',
      // value: '597849cd0d77d8435fdf65dc',
      value: 'DTLGM',
    },
  ],

  onFilter: (value, record) => record.abbreviation(value) === value,

  render: curriculums => {
    console.log("render curriculums: ", curriculums);
    
    // console.log("render curriculums.abbreviation: ", curriculums.abbreviation);
    
    if (curriculums.length === 0) return null
    return curriculums.map((c, i) => {
      const url = '/curriculum/s/' + c.slugs.et
      const abbr = c.abbreviation

      console.log(abbr);
      console.log("c: ", c);
      console.log("i: ", i);
      console.log("url: ", url);
      console.log("abbr: ", abbr);

      const content =
        i < curriculums.length - 1 && curriculums.length > 1
          ? abbr + ', '
          : abbr

      return (
        <Tooltip
          key={c._id}
          placement='topLeft'
          title={c.names.et + ' ' + c.type}
        >
          <Link className='link-curriculum' to={url}>
            {content}
          </Link>
        </Tooltip>
      )
    })
  }
})

const detailTypes = () => ({
  className: 'text-align--left',
  dataIndex: 'types',
  key: 'types',
  title: 'Types',
  render: types => {
    console.log("render types: ", types);
    if (types.length === 0) return null
    return types.map((t, i) => {
      const content = i < types.length - 1 && types.length > 1 ? t + ', ' : t

      return (
        <Tooltip key={t} placement='topLeft' title={typesMap[t]}>
          {content}
        </Tooltip>
      )
    })
  }
})

const file = ({ columnKey, order }) => ({
  title: '',
  className: 'text-align--right',
  dataIndex: 'file',
  key: 'file',
  sortOrder: columnKey === 'file' && order,
  render: file => {
    const content = (
      <span>
        <a href={file}>
          <Tooltip title='Download .pdf'>
            <DownloadOutlined className='icon--download' />
          </Tooltip>
        </a>
      </span>
    )
    return content
  }
})

const registered = ({ columnKey, order }) => ({
  title: 'Registered',
  dataIndex: 'registered',
  key: 'registered',
  className: 'text-align--right',
  render: renderDate,
  sorter: true,
  sortOrder: columnKey === 'registered' && order
})

const supervisors = () => ({
  title: 'Supervisor(s)',
  dataIndex: 'supervisors',
  key: 'supervisors',
  render: arr => {
    console.log("supervisors arr: ", arr);
    return arr.map((o, i) => {
      const { _id, profile } = o.supervisor
      const linkContent =
        i < arr.length - 1 && arr.length > 1
          ? profile.firstName + ' ' + profile.lastName + ', '
          : profile.firstName + ' ' + profile.lastName

      const url = '/supervisor/' + profile.slug

      // console.log("supervisors o.supervisor: ", o.supervisor);
      // console.log("supervisors o: ", o);
      console.log("supervisors linkContent: ", linkContent);
      console.log("supervisors url: ", url);
      return (
        <Link key={_id} to={url}>
          {linkContent}
        </Link>
      )
    })
  }
})

const title = ({ columnKey, order, sub, q }) => ({
  title: 'Title',
  dataIndex: 'title',
  key: 'title',
  sorter: true,
  sortOrder: columnKey === 'title' && order,
  render: (title, row) => {
    console.log("render title + row: ", title, " : ", row);
    let finalTitle = title

    if (q) {
      finalTitle = reactStringReplace(title, q, (match, i) => (
        <span key={i} className='highlight'>{match}</span>
      ))
    }

    const { starred, file: fileUrl, slug } = row
    const fileInViewerUrl = <a href={'https://docs.google.com/gview?url=' + fileUrl} target='_blank'>{finalTitle}</a>
    const topicTitle = sub === 'defended'
      ? fileInViewerUrl
      : finalTitle
    const shareUrl = window.location.host + '/search?' + queryString.stringify({ q: slug, sub })

    const content = (
      <span>
        {topicTitle}
        {starred &&
          <Tooltip title='Esiletõstetud töö'>
            {' '}<StarOutlined style={{color: 'gold'}} />
          </Tooltip>}
        <CopyToClipboard text={shareUrl} onCopy={() => message.success('Link copied to clipboard')}>
          <Tooltip title='Copy link to clipboard'>
            <CopyOutlined className='icon--copy' />
          </Tooltip>
        </CopyToClipboard>
      </span>
    )

    return content
  }
})

const types = ({ columnKey, order, sub, types }) => ({
  className: 'text-align--center',
  filterMultiple: false,
  filters: [
    {
      text: sub === 'available' ? 'Sobib seminaritööks' : 'Seminaritöö',
      value: 'SE'
    }
  ],
  sorter: true,
  sortOrder: columnKey === 'types' && order,
  title: (
    <Tooltip
      placement='top'
      title={sub === 'available' ? 'Sobib seminaritööks' : 'Seminaritöö'}
    >
      {'SE'}
    </Tooltip>
  ),
  dataIndex: 'types',
  key: 'types',
  filteredValue: types || null,
  render: types => {
    let content = null
    if (types.indexOf('SE') !== -1) {
      content = <Badge
        className='no-status-margin'
        status='default'
      />
    }
    return content
  }
})

const renderDate = date => moment(date).format('DD.MM.YY')

const getColumnNames = ({ sub, names, type, supervisor }) => {
  let columns = ['title'] // default

  const isInformaticsBa = names && names.et === 'Informaatika' && type === 'BA'
  const isSupervisorPage = !!supervisor

  if (sub === 'registered') {
    if (isSupervisorPage) {
      columns.push('detailTypes')
      columns.push('detailCurriculums')
    }
    if (isInformaticsBa) columns.push('types')
    columns.push('detailCurriculums') // lisatud

    columns.push('author', 'supervisors', 'registered')
  }

  if (sub === 'available') {
    if (isSupervisorPage) {
      columns.push('detailTypes')
      columns.push('detailCurriculums')
    } else {
      columns.push('curriculums')
    }
    if (isInformaticsBa) columns.push('types')

    columns.push('supervisors', 'accepted')
  }

  if (sub === 'defended') {
    if (isSupervisorPage) columns.push('detailTypes')
    columns.push('detailCurriculums')
    if (isInformaticsBa) columns.push('types')

    columns.push('author', 'supervisors', 'defended', 'file')
  }

  return columns
}

const definedColumns = {
  accepted,
  author,
  curriculums,
  defended,
  detailCurriculums,
  detailTypes,
  file,
  registered,
  supervisors,
  title,
  types
}
