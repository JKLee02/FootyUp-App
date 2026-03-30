import { createBrowserRouter } from "react-router-dom"
import Home from './UserPages/Home/Home.jsx'
import AboutUs from './UserPages/AboutUs/AboutUs.jsx'
import ContactUs from './UserPages/ContactUs/ContactUs.jsx'
import HowToUse from './UserPages/HowToUse/HowToUse.jsx'
import PrivacyPolicy from './UserPages/PrivacyPolicy/PrivacyPolicy.jsx'
import Login from './UserPages/Login/Login.jsx'
import SignUp from './UserPages/SignUp/SignUp.jsx'
import UserHome from "./UserPages/UserHome/UserHome.jsx"
import UserProfile from "./UserPages/UserProfile/UserProfile.jsx"
import UserVenue from "./UserPages/UserVenue/UserVenue.jsx"
import UserTeam from "./UserPages/UserTeam/UserTeam.jsx"
import UserTournaments from "./UserPages/UserTournaments/UserTournaments.jsx"
import UserCreateTeam from "./UserPages/UserCreateTeam/UserCreateTeam.jsx"
import UserSelectVenue from "./UserPages/UserSelectVenue/UserSelectVenue.jsx"
import UserHostTournament from "./UserPages/UserHostTournament/UserHostTournament.jsx"
import UserTeamProfile from "./UserPages/UserTeamProfile/UserTeamProfile.jsx"
import UserVenueDetails from "./UserPages/UserVenueDetails/UserVenueDetails.jsx"
import UserTournamentDetails from "./UserPages/UserTournamentDetails/UserTournamentDetails.jsx"
import UserEditTournament from "./UserPages/UserEditTournament/UserEditTournament.jsx"
import UserTeamSchedule from "./UserPages/UserTeamSchedule/UserTeamSchedule.jsx"
import UserViewMembers from "./UserPages/UserViewMembers/UserViewMembers.jsx"
import UserUpdateTeam from "./UserPages/UserUpdateTeam/UserUpdateTeam.jsx"
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx"
import AdminProtectedRoute from "./Components/AdminProtectedRoute/AdminProtectedRoute.jsx"

// importing Admin Components/Pages
import AdminHome from "./AdminPages/AdminHome/AdminHome.jsx"
import AdminTeamsList from "./AdminPages/AdminTeamsList/AdminTeamsList.jsx"
import AdminPlayersList from "./AdminPages/AdminPlayersList/AdminPlayersList.jsx"
import AdminMatchesList from "./AdminPages/AdminMatchesList/AdminMatchesList.jsx"
import AdminApproval from "./AdminPages/AdminApproval/AdminApproval.jsx"
import AdminLogin from "./AdminPages/AdminLogin/AdminLogin.jsx"
import AdminVenuesList from "./AdminPages/AdminVenuesList/AdminVenuesList.jsx"

export const router = createBrowserRouter([
//React router for the pre-logged in pages
    {
      path: '/',
      element: <Home></Home>,
      errorElement: <div>404 Not Found</div>
    },
  
    {
      path: '/aboutus',
      element: <AboutUs></AboutUs>,
      errorElement: <div>404 Not Found</div>
    },
  
    {
      path: '/contactus',
      element: <ContactUs></ContactUs>,
      errorElement: <div>404 Not Found</div>
    },
  
    {
      path: '/howtouse',
      element: <HowToUse></HowToUse>,
      errorElement: <div>404 Not Found</div>
    },
  
    {
      path: '/privacypolicy',
      element: <PrivacyPolicy></PrivacyPolicy>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/login',
      element: <Login></Login>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/signup',
      element: <SignUp></SignUp>,
      errorElement: <div>404 Not Found</div>
    },

// Router for the logged in pages
// User Protected Routes
    {
      path: '/userhome',
      element: <ProtectedRoute><UserHome></UserHome></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },
    {
      path: '/userprofile',
      element: <ProtectedRoute><UserProfile></UserProfile></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },
    {
      path: '/uservenue',
      element: <ProtectedRoute><UserVenue></UserVenue></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },  
    {
      path: '/uservenuedetails/:venueId',
      element: <ProtectedRoute><UserVenueDetails></UserVenueDetails></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },  
    {
      path: '/userteam',
      element: <ProtectedRoute><UserTeam></UserTeam></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    //Route for user team profiles with their respective IDs
    {
      path: '/userteamprofile/:teamId',
      element: <ProtectedRoute><UserTeamProfile></UserTeamProfile></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/usertournaments',
      element: <ProtectedRoute><UserTournaments></UserTournaments></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },
    
    {
      path: '/usercreateteam',
      element: <ProtectedRoute><UserCreateTeam></UserCreateTeam></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/userupdateteam/:teamId',
      element: <ProtectedRoute><UserUpdateTeam></UserUpdateTeam></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/userselectvenue',
      element: <ProtectedRoute><UserSelectVenue></UserSelectVenue></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/userhosttournament/:venueId',
      element: <ProtectedRoute><UserHostTournament></UserHostTournament></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/useredittournament/:tournamentId',
      element: <ProtectedRoute><UserEditTournament></UserEditTournament></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/usertournamentdetails/:tournamentId',
      element: <ProtectedRoute><UserTournamentDetails></UserTournamentDetails></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/userteamschedule/:teamId',
      element: <ProtectedRoute><UserTeamSchedule></UserTeamSchedule></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/userviewmembers/:teamId',
      element: <ProtectedRoute><UserViewMembers></UserViewMembers></ProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },
    // Original user team profile route, just in case 
    // {
    //   path: '/userteamprofile',
    //   element: <UserTeamProfile></UserTeamProfile>,
    //   errorElement: <div>404 Not Found</div>
    // },


// Admin Protected Routes
    {
      path: '/adminlogin',
      element: <AdminLogin></AdminLogin>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/adminhome',
      element: <AdminProtectedRoute><AdminHome></AdminHome></AdminProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/adminteamslist',
      element: <AdminProtectedRoute><AdminTeamsList></AdminTeamsList></AdminProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/adminplayerslist',
      element: <AdminProtectedRoute><AdminPlayersList></AdminPlayersList></AdminProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/adminmatcheslist',
      element: <AdminProtectedRoute><AdminMatchesList></AdminMatchesList></AdminProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/adminvenueslist',
      element: <AdminProtectedRoute><AdminVenuesList></AdminVenuesList></AdminProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/adminapproval',
      element: <AdminProtectedRoute><AdminApproval></AdminApproval></AdminProtectedRoute>,
      errorElement: <div>404 Not Found</div>
    },


  ])