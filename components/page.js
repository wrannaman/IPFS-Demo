import { Component } from 'react'
import { Provider } from 'mobx-react'

import { setWeb3Instance, getBookmarks } from '../services/blockChainService'
import Nav from '../components/navigation'

class Page extends Component {
  componentDidMount() {
      // setWeb3Instance()
      // .then(() => getBookmarks())
      // .then(shows => this.props.store.setBookmarkShows(shows))
  }


  render() {
    console.log('this props ', this.props);
    return (
      <Provider store={this.props.store}>
        <div>
          <Nav selected={this.props.type} />
        </div>
        <div>
          {this.props.children}
        </div>
      </Provider>
    )
  }
}

export default Page
