import React from 'react'
import TicketList from './TicketList'
import Header from './Header'
import NewTicketControl from './NewTicketControl'
import { Switch, Route } from 'react-router-dom'
import Error404 from './Error404'
import Admin from './Admin'
import { v4 } from 'uuid';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      masterTicketList: {},
      selectedTicket: null
    }
    this.handleAddingNewTicketToList = this.handleAddingNewTicketToList.bind(this)
    this.handleChangingSelectedTicket = this.handleChangingSelectedTicket.bind(this)
  }

  componentDidMount() {
    this.waitTimeUpdateTimer = setInterval(() =>
      this.updateTicketElapsedWaitTime(),
    60000)
  }

  updateTicketElapsedWaitTime() {
    var newMasterTicketList = Object.assign({}, this.state.masterTicketList);
    Object.keys(newMasterTicketList).forEach(ticketId => {
      newMasterTicketList[ticketId].formattedWaitTime = (newMasterTicketList[ticketId].timeOpen).fromNow(true);
    });
    this.setState({masterTicketList: newMasterTicketList});
  }

  componentWillUnmount(){
    clearInterval(this.waitTimeUpdateTimer)
  }

  handleAddingNewTicketToList(newTicket){
    var newTicketId = v4()
    var newMasterTicketList = Object.assign({}, this.state.masterTicketList, {
      [newTicketId]: newTicket
    });
    newMasterTicketList[newTicketId].formattedWaitTime = newMasterTicketList[newTicketId].timeOpen.fromNow(true);
    this.setState({masterTicketList: newMasterTicketList});
  }

  handleChangingSelectedTicket(ticketId){
    this.setState({selectedTicket: ticketId});
  }

  render(){
    return (
      <div>
        <Header/>
        <Switch>
          <Route exact path='/' render={()=><TicketList ticketList={this.state.masterTicketList} />} />
          <Route path='/newticket' render={()=><NewTicketControl onNewTicketCreation={this.handleAddingNewTicketToList}/>}/>
          <Route path='/admin' render={(props)=><Admin onTicketSelection={this.handleChangingSelectedTicket} ticketList={this.state.masterTicketList} currentRouterPath={props.location.pathname} selectedTicket={this.state.selectedTicket} />} />
          <Route component={Error404} />
        </Switch>
      </div>
    )
  }

}

export default App
