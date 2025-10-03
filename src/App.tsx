import { useFieldArray, useForm } from "react-hook-form";
import { Reorder, useDragControls } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTrash } from '@fortawesome/free-solid-svg-icons';


interface Destinatario {
  id: number;
  nome: string;
  indirizzo: string;
  defaultSort?: number;
}

interface FormData {
  destinatari: Destinatario[];
}

export default function App() {

  const dragControls = useDragControls();

  const { control, register, handleSubmit } = useForm<FormData>({
    defaultValues: { destinatari: [] },
  });


  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "destinatari",
  });


  function handleReorder(nuoviId: number[]) {
    for (let i = 0; i < nuoviId.length; i++) {
      if (fields[i].id !== nuoviId[i]) {
        const from = fields.findIndex(f => f.id === nuoviId[i]);
        const to = i;
        if (from !== -1 && to !== -1 && from !== to) {
          move(from, to);
        }
        break;
      }
    }
  }
  
  function handleDelete(id: number) {
    const index = fields.findIndex(f => f.id === id);
    if (index !== -1) {
      remove(index);
    }
  }

  function onSubmit(data: FormData) {
    data.destinatari.forEach((destinatario, index) => {
      destinatario.defaultSort = index;
    });
    console.table(data.destinatari);
  }


  function appendItem() {
    append({ id: Date.now(), nome: "", indirizzo: "", defaultSort: fields.length });
  }

  return (
    <div className='page'>
      <div className='page-content'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Reorder.Group axis="y"
            values={fields}
            onReorder={ids => handleReorder(ids.map(f => f.id))}>
            {fields.map((field, index) => (
              <Reorder.Item key={field.id} value={field} dragListener={true} dragControls={dragControls}>
                <div style={{ marginBottom: '10px' }}>
                  <button type='button' >
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                  <input
                    {...register(`destinatari.${fields.findIndex(f => f.id === field.id)}.nome` as const)}
                    placeholder="inserisci nome"
                  />
                  <input
                    {...register(`destinatari.${fields.findIndex(f => f.id === field.id)}.indirizzo` as const)}
                    placeholder="inserisci indirizzo"
                  />
                  <button type='button' onClick={() => handleDelete(field.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>


                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <button type='button' onClick={appendItem}>Add Item</button>

          <hr />
          <button className='submit' type="submit">Submit</button>
        </form>

      </div>
    </div>
  )
}