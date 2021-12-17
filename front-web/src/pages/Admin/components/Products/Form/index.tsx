import './styles.scss';

import { makePrivateRequest, makeRequest } from 'core/utils/request';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';

import BaseForm from '../../BaseForm';
import { Category } from 'core/types/Category';


type FormState = {
  name: string;
  price: string;
  category?: string;
  description: string;
  imgUrl: string;
}
type ParamsType = {
  productId: string;
}
const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const Form = () => {

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormState>();
  const history = useHistory();
  const { productId } = useParams<ParamsType>();
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const isEditing = productId !== 'create';
  const formTitle = isEditing ? 'Editar produto' : 'Cadastrar produto';

  useEffect(() => {
    if (isEditing) {
      makeRequest({ url: `/products/${productId}` })
        .then(response => {
          setValue('name', response.data.name);
          setValue('price', response.data.price);
          setValue('description', response.data.description);
          setValue('imgUrl', response.data.imgUrl);

        });
    }
  }, [productId, isEditing, setValue]);

  useEffect(() => {
    setIsLoadingCategories(true);
    makeRequest({ url: '/categories' })
      .then(response => setCategories(response.data.content))
      .finally(() => setIsLoadingCategories(false));
  }, [])

  const onSubmit = (data: FormState) => {
    makePrivateRequest(
      {
        url: isEditing ? `/products/${productId}` : '/products',
        method: isEditing ? 'PUT' : 'POST',
        data
      }
    )
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

            <div className='margin-bottom-30'>
              <Select
                options={options}
                classNamePrefix="categories-select"
                placeholder="Categoria"
                isMulti
              />
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
                step=".01"
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
              {errors.imgUrl && (
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
              className={`form-control input-base ${errors.description ? 'is-invalid' : ''}`}
              placeholder='Descrição'
              cols={30}
              rows={10}
            />
            {errors.description && (
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
