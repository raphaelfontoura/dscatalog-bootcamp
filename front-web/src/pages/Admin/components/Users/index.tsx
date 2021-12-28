import { Route, Switch } from "react-router-dom"
import UserForm from "./Form";
import UserList from "./List";

const Users = () => {
  return (
    <Switch>
      <Route path='/admin/users' exact>
        <UserList />
      </Route>
      <Route path='/admin/users/:userId'>
        <UserForm />
      </Route>
    </Switch>
  )
}

export default Users
