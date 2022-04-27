import React, {Component} from 'react'
import {Button, Card} from 'antd'
import './not-found.css'
/*
前台404页面
 */
export default class NotFound extends Component {
  render() {
    return (
      <Card className='not-found'>
        <div className='page'>
          <h1>404</h1>
          <h2>抱歉，您访问的页面不存在</h2>
          <div>
            <Button type='primary' onClick={() => this.props.history.replace('/home')}>
              回到首页
            </Button>
          </div>
        </div>
      </Card>
    )
  }
}