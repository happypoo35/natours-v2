import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout, Home, Tours, Tour, Auth, Account } from "components";
import {
  Loader,
  Modal,
  ServiceMsg,
  Error,
  CheckoutStatus,
} from "components/Common";
import RequireAuth from "utils/RequireAuth";
import ScrollToTop from "utils/ScrollToTop";
import RestrictTo from "utils/RestrictTo";
import IsAuth from "utils/IsAuth";

const App = () => {
  return (
    <Router>
      <ScrollToTop exceptions={["login", "signup", "account"]} />
      <Loader />
      <ServiceMsg />
      <Modal />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:slug" element={<Tour />} />
          <Route path="/checkout" element={<CheckoutStatus />} />
          <Route
            element={
              <IsAuth>
                <Auth.Layout />
              </IsAuth>
            }
          >
            <Route path="/login" element={<Auth.Login />} />
            <Route path="/signup" element={<Auth.Signup />} />
            <Route
              path="/password-recovery"
              element={<Auth.ForgotPassword />}
            />
            <Route
              path="/reset-password/:token"
              element={<Auth.ResetPassword />}
            />
          </Route>
          <Route
            path="/account"
            element={
              <RequireAuth>
                <Account.Layout />
              </RequireAuth>
            }
          >
            <Route index element={<Account.Settings />} />
            <Route path="bookings" element={<Account.Bookings />} />
            <Route path="reviews" element={<Account.Reviews />} />
            <Route path="billing" element={<Account.Billing />} />
            <Route element={<RestrictTo />}>
              <Route path="manage-tours">
                <Route index element={<Account.ManageTours.ToursList />} />
                <Route
                  path=":tourId"
                  element={<Account.ManageTours.Tour newTour={false} />}
                >
                  <Route index element={<Account.ManageTours.TourForm />} />
                  <Route
                    path="bookings"
                    element={<Account.ManageTours.TourBookings />}
                  />
                  <Route
                    path="reviews"
                    element={<Account.ManageTours.TourReviews />}
                  />
                </Route>
                <Route
                  path="new-tour"
                  element={<Account.ManageTours.Tour newTour={true} />}
                >
                  <Route index element={<Account.ManageTours.TourForm />} />
                </Route>
              </Route>
              <Route path="manage-users">
                <Route index element={<Account.ManageUsers.UsersList />} />
                <Route path=":userId" element={<Account.ManageUsers.User />}>
                  <Route index element={<Account.ManageUsers.UserForm />} />
                  <Route
                    path="bookings"
                    element={<Account.ManageUsers.UserBookings />}
                  />
                  <Route
                    path="reviews"
                    element={<Account.ManageUsers.UserReviews />}
                  />
                </Route>
              </Route>
              <Route path="manage-reviews">
                <Route index element={<Account.ManageReviews.ReviewsList />} />
                <Route
                  path=":reviewId"
                  element={<Account.ManageReviews.Review />}
                />
              </Route>
              <Route path="manage-bookings">
                <Route
                  index
                  element={<Account.ManageBookings.BookingsList />}
                />
                <Route
                  path=":bookingId"
                  element={<Account.ManageBookings.Booking />}
                />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
