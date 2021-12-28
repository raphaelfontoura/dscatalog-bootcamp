
import { Roles } from "core/types/User";
import { makePrivateRequest } from "core/utils/request";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BaseForm from "../../BaseForm"

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeat_password: string;
  roles: Roles[];
}

type ParamsType = {
  userId: string;
}

const UserForm = () => {

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormState>();
  const history = useHistory();
  const { userId } = useParams<ParamsType>();
  const isEditing = userId !== 'create';
  const formTitle = isEditing ? 'Editar usuário' : 'Cadastrar usuário';

  useEffect(() => {
    if (isEditing) {
      makePrivateRequest({ url: `/users/${userId}` })
        .then(response => {
          setValue("firstName", response.data.firstName);
          setValue("lastName", response.data.lastName);
          setValue("email", response.data.email);
          setValue("roles", response.data.roles);
        });
    }
  }, [userId, isEditing, setValue]);

  const onSubmit = (data: FormState) => {
    const payload = isEditing ? {
      ...data
    } : {
      ...data,
      roles: [{
        id: 1,
        authority: "ROLE_OPERATOR"
      }]
    }

    makePrivateRequest(
      {
        url: isEditing ? `/users/${userId}` : '/users',
        method: isEditing ? 'PUT' : 'POST',
        data: payload
      }
    )
      .then(() => {
        toast.info("Usuário salvo com sucesso!");
        history.push("/admin/users");
      })
      .catch(() => {
        toast.error("Erro ao salvar usuário!")
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BaseForm title={formTitle}>
        <div className="row">
          <div className="col-6">

            <div className='margin-bottom-30'>
              <input
                {...register('firstName',
                  {
                    required: {
                      value: true,
                      message: "Campo obrigatório"
                    },
                    minLength: {
                      value: 3,
                      message: "Deve ter no mínimo 3 caracteres"
                    },
                    maxLength: {
                      value: 60,
                      message: "Deve ter no máximo 60 caracteres"
                    }
                  }
                )}
                name="firstName"
                type="text"
                className={`form-control input-base ${errors.firstName ? 'is-invalid' : ''}`}
                placeholder="Nome do Usuário"
              />
              {errors.firstName && (
                <div className="invalid-feedback d-block">
                  {errors.firstName.message}
                </div>
              )}
            </div>


          </div>
          <div className="col-6">

            <div className='margin-bottom-30'>
              <input
                {...register('lastName',
                  {
                    required: {
                      value: true,
                      message: "Campo obrigatório"
                    },
                    minLength: {
                      value: 3,
                      message: "Deve ter no mínimo 3 caracteres"
                    },
                    maxLength: {
                      value: 60,
                      message: "Deve ter no máximo 60 caracteres"
                    }
                  }
                )}
                name="lastName"
                type="text"
                className={`form-control input-base ${errors.lastName ? 'is-invalid' : ''}`}
                placeholder="Sobrenome do Usuário"
              />
              {errors.lastName && (
                <div className="invalid-feedback d-block">
                  {errors.lastName.message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">

            <div className='margin-bottom-30'>
              <input
                {...register('email',
                  {
                    required: {
                      value: true,
                      message: "Campo obrigatório"
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
                      message: "Email inválido"
                    }
                  }
                )}
                name="email"
                type="text"
                className={`form-control input-base ${errors.email ? 'is-invalid' : ''}`}
                placeholder="E-mail"
              />
              {errors.email && (
                <div className="invalid-feedback d-block">
                  {errors.email.message}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">

            <div className='margin-bottom-30'>
              <input
                {...register('password',
                  {
                    required: {
                      value: true,
                      message: "Campo obrigatório"
                    },
                    minLength: {
                      value: 6,
                      message: "Deve ter no mínimo 6 caracteres"
                    },
                    maxLength: {
                      value: 60,
                      message: "Deve ter no máximo 60 caracteres"
                    }
                  }
                )}
                name="password"
                id="password"
                type="password"
                className={`form-control input-base ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Password"
              />
              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password.message}
                </div>
              )}
            </div>


          </div>
          <div className="col-6">

            <div className='margin-bottom-30'>
              <input
                {...register('repeat_password',
                  {
                    required: {
                      value: true,
                      message: "Campo obrigatório"
                    },
                    validate: v => {
                      const input = document.getElementById("password") as HTMLInputElement;
                      return v === input.value || "Passwords não correspondem";
                    }

                  }
                )}
                name="repeat_password"
                type="password"
                className={`form-control input-base ${errors.repeat_password ? 'is-invalid' : ''}`}
                placeholder="Repetir Password"
              />
              {errors.repeat_password && (
                <div className="invalid-feedback d-block">
                  {errors.repeat_password.message}
                </div>
              )}
            </div>
          </div>
        </div>

      </BaseForm>
    </form>
  );

}

export default UserForm
