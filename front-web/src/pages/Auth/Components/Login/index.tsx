import ButtonIcon from "core/components/ButtonIcon";
import { Link, useHistory } from "react-router-dom";
import { useForm } from 'react-hook-form'
import AuthCard from "../Card";
import "./styles.scss";
import { makeLogin } from "core/utils/request";
import { useState } from "react";
import { saveSessionData } from "core/utils/auth";

type FormData = {
  username: string;
  password: string;
}

const Login = () => {

  const { register, formState: { errors }, handleSubmit } = useForm<FormData>();
  const [hasError, setHasError] = useState(false);
  const history = useHistory();

  const onSubmit = (data: FormData) => {
    makeLogin(data)
      .then(response => {
        setHasError(false);
        saveSessionData(response.data);
        history.push('/admin');
      })
      .catch(() => {
        setHasError(true);
      })
  }

  return (
    <AuthCard title="login">
      {hasError && (
        <div className="alert alert-danger mt-3">
          Usuário ou senha inválidos!
        </div>
      )}
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="margin-bottom-30">

          <input
            type="email"
            className={`form-control input-base ${errors.username ? 'is-invalid' : ''}`}
            placeholder="Email"
            {...register("username",
              {
                required: {
                  value: true,
                  message: "Campo obrigatório"
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
                  message: "Email inválido"
                }
              })
            }
          />
          {errors.username && (
            <div className="invalid-feedback d-block">
              {errors.username.message}
            </div>
          )}
        </div>

        <div>
          <input
            type="password"
            className={`form-control input-base ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Senha"
            {...register("password", {

                required: {
                  value: true,
                  message: "Campo obrigatório"
                },
                minLength: {
                  value: 4,
                  message: "Mínimo de 4 dígitos"
                }
              })
            }
          />
          {errors.password && (
            <div className="invalid-feedback d-block">
              {errors.password.message}
            </div>
          )}
        </div>

        <Link to="/admin/auth/recover" className="login-link-recover">
          Esqueci a senha?
        </Link>
        <div className="login-submit">

          <ButtonIcon text="logar" />
        </div>
        <div className="text-center">
          <span className="not-register">Não tem Cadastro?</span>
          <Link to="/admin/auth/register" className="login-link-register">CADASTRAR</Link>
        </div>
      </form>
    </AuthCard>
  )
}

export default Login
