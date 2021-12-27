
import { makePrivateRequest } from "core/utils/request";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BaseForm from "../../BaseForm"

type FormState = {
  name: string;
}

type ParamsType = {
  categoryId: string;
}

const CategoryForm = () => {

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormState>();
  const history = useHistory();
  const { categoryId } = useParams<ParamsType>();
  const isEditing = categoryId !== 'create';
  const formTitle = isEditing ? 'Editar categoria' : 'Cadastrar categoria';

  useEffect(() => {
    if (isEditing) {
      makePrivateRequest({ url: `/categories/${categoryId}` })
        .then(response => {
          setValue('name', response.data.name);
        });
    }
  }, [categoryId, isEditing, setValue]);

  const onSubmit = (data: FormState) => {
    const payload = {
      ...data
    }
    makePrivateRequest(
      {
        url: isEditing ? `/categories/${categoryId}` : '/categories',
        method: isEditing ? 'PUT' : 'POST',
        data: payload
      }
    )
      .then(() => {
        toast.info("Categoria salva com sucesso!");
        history.push("/admin/categories");
      })
      .catch(() => {
        toast.error("Erro ao salvar categoria!")
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BaseForm title={formTitle}>
        <div className="row">
          <div className="col-6">

            <div className='margin-bottom-30'>
              <input
                {...register('name',
                  {
                    required: {
                      value: true,
                      message: "Campo obrigatório"
                    },
                    minLength: {
                      value: 5,
                      message: "Deve ter no mínimo 5 caracteres"
                    },
                    maxLength: {
                      value: 60,
                      message: "Deve ter no máximo 60 caracteres"
                    }
                  }
                )}
                name="name"
                type="text"
                className={`form-control input-base ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Nome do Produto"
              />
              {errors.name && (
                <div className="invalid-feedback d-block">
                  {errors.name.message}
                </div>
              )}
            </div>


          </div>
        </div>
      </BaseForm>
    </form>
  );
  
}

export default CategoryForm
