import './styles.scss';

import { makePrivateRequest } from 'core/utils/request';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
 
import BaseForm from '../../BaseForm';
import { useHistory } from 'react-router-dom';

type FormState = {
  name: string;
  price: string;
  category?: string;
  description: string;
  imgUrl: string;
}

const Form = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormState>();
  const history = useHistory();

  const onSubmit = (data: FormState) => {
    makePrivateRequest({ url: '/products', method: 'POST', data })
      .then(() => {
        toast.info("Produto salvo com sucesso!");
        history.push("/admin/products");
      })
      .catch(() => {
        toast.error("Erro ao salvar produto!")
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BaseForm title="CADASTRAR UM PRODUTO">
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

            <div className="margin-bottom-30">
              <input
                {...register('price', {
                  required: {
                    value: true,
                    message: 'Campo obrigatório'
                  }
                }
                )}
                name="price"
                type="number"
                className={`form-control input-base ${errors.price ? 'is-invalid' : ''}`}
                placeholder="Preço"
              />
              {errors.price && (
                <div className="invalid-feedback d-block">
                  {errors.price.message}
                </div>
              )}
            </div>

            <div className="margin-bottom-30">
              <input
                {...register('imgUrl',
                  {
                    required: {
                      value: true,
                      message: "Campo obrigatório"
                    }
                  }
                )}
                name="imgUrl"
                type="text"
                className={`form-control input-base ${errors.imgUrl ? 'is-invalid' : ''}`}
                placeholder="Url da imagem do Produto"
              />
              { errors.imgUrl && (
                <div className="invalid-feedback d-block">
                  {errors.imgUrl.message}
                </div>
              )}
            </div>

          </div>
          <div className="col-6">
            <textarea
              {...register('description',
                {
                  required: {
                    value: true,
                    message: "Campo obrigatório"
                  }
                }
              )}
              name="description"
              className={`form-control input-base ${errors.description ? 'is-invalid': ''}`}
              placeholder='Descrição'
              cols={30}
              rows={10}
            />
            { errors.description && (
              <div className="invalid-feedback">
                {errors.description.message}
              </div>
            )}
          </div>
        </div>
      </BaseForm>
    </form>
  );
}

export default Form;
