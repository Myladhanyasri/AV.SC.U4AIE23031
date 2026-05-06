import { useEffect, useState } from "react";
import axios from "axios";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/notifications"
      );

      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Campus Notification Dashboard
      </Typography>

      <Grid container spacing={2}>
        {notifications.map((n, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {n.message}
                </Typography>

                <Chip
                  label={n.type}
                  sx={{ mt: 1 }}
                />

                <Typography sx={{ mt: 2 }}>
                  {n.createdAt}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default App;