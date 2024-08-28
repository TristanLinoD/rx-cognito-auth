import React, { useState, useEffect } from "react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { awsExports } from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Auth } from "aws-amplify";
import { LogoImage } from "./components/logoComponent";

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
  },
});

function App() {
  const [jwtToken, setJwtToken] = useState("");

  useEffect(() => {
    fetchJwtToken();
  }, []);

  const fetchJwtToken = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      setJwtToken(token);
    } catch (error) {
      console.log("Error fetching JWT token:", error);
    }
  };

  return (
    <div class="center">
      <div class="form">
        <LogoImage />
        <Authenticator
          initialState="signIn"
          components={{
            SignUp: {
              FormFields() {
                return (
                  <>
                    <Authenticator.SignUp.FormFields />

                    {/* Custom fields for given_name and family_name */}
                    <div>
                      <label>Correo Electronico</label>
                    </div>
                    <input
                      type="text"
                      name="email"
                      placeholder="Porfavor intrduce un correo electronico valido."
                    />
                    <div>
                      <label>Contraseña</label>
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Porfavor introduce una contraseña"
                    />
                  </>
                );
              },
            },
          }}
          services={{
            async validateCustomSignUp(formData) {
              if (!formData.email) {
                return {
                  email: "El correo electronico es requerido",
                };
              }
              if (!formData.password) {
                return {
                  email: "La contraseña es requerida",
                };
              }
            },
          }}
        >
          {({ signOut, user }) => (
            <div>
              Welcome {user.username}
              <button onClick={signOut}>Sign out</button>
              <h4>Your JWT token:</h4>
              {jwtToken}
            </div>
          )}
        </Authenticator>
      </div>
    </div>
  );
}

export default App;
