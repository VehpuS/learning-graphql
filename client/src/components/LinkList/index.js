import React, { Component } from 'react'
import Link from '../Link'
import linksToRender from './mockLinks'

class LinkList extends Component {
    render() {
        return (
            <div>
                {linksToRender.map(
                    link => <Link key={link.id} link={link} />)}
            </div>
        )
    }
}

export default LinkList
