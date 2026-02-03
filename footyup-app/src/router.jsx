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
// User
    {
      path: '/userhome',
      element: <UserHome></UserHome>,
      errorElement: <div>404 Not Found</div>
    },
    {
      path: '/userprofile',
      element: <UserProfile></UserProfile>,
      errorElement: <div>404 Not Found</div>
    },
    {
      path: '/uservenue',
      element: <UserVenue></UserVenue>,
      errorElement: <div>404 Not Found</div>
    },  
    {
      path: '/uservenuedetails/:venueId',
      element: <UserVenueDetails></UserVenueDetails>,
      errorElement: <div>404 Not Found</div>
    },  
    {
      path: '/userteam',
      element: <UserTeam></UserTeam>,
      errorElement: <div>404 Not Found</div>
    },

    //Route for user team profiles with their respective IDs
    {
      path: '/userteamprofile/:teamId',
      element: <UserTeamProfile></UserTeamProfile>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/usertournaments',
      element: <UserTournaments></UserTournaments>,
      errorElement: <div>404 Not Found</div>
    },
    
    {
      path: '/usercreateteam',
      element: <UserCreateTeam></UserCreateTeam>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/userupdateteam/:teamId',
      element: <UserUpdateTeam></UserUpdateTeam>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/userselectvenue',
      element: <UserSelectVenue></UserSelectVenue>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/userhosttournament/:venueId',
      element: <UserHostTournament></UserHostTournament>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/useredittournament/:tournamentId',
      element: <UserEditTournament></UserEditTournament>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/usertournamentdetails/:tournamentId',
      element: <UserTournamentDetails></UserTournamentDetails>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/userteamschedule/:teamId',
      element: <UserTeamSchedule></UserTeamSchedule>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/userviewmembers/:teamId',
      element: <UserViewMembers></UserViewMembers>,
      errorElement: <div>404 Not Found</div>
    },
    // Original user team profile route, just in case 
    // {
    //   path: '/userteamprofile',
    //   element: <UserTeamProfile></UserTeamProfile>,
    //   errorElement: <div>404 Not Found</div>
    // },


// Admin
    {
      path: '/adminlogin',
      element: <AdminLogin></AdminLogin>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/adminhome',
      element: <AdminHome></AdminHome>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/adminteamslist',
      element: <AdminTeamsList></AdminTeamsList>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/adminplayerslist',
      element: <AdminPlayersList></AdminPlayersList>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/adminmatcheslist',
      element: <AdminMatchesList></AdminMatchesList>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/adminvenueslist',
      element: <AdminVenuesList></AdminVenuesList>,
      errorElement: <div>404 Not Found</div>
    },

    {
      path: '/adminapproval',
      element: <AdminApproval></AdminApproval>,
      errorElement: <div>404 Not Found</div>
    },


  ])