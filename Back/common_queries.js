const getNLSQuery = (name, descr, table_id, lang_id, table_name) => 
{
  var descr_field_name = 'descr';
  if (table_name==='dose_ratio') descr_field_name = 'fullname';

  const sql_nls = `DO $$ `+
  `declare aname VARCHAR := '${name}'; `+
  `declare adesc text := '${descr}'; `+
  `declare a${table_name}_id INT4 := ${table_id}; `+
  `declare alang_id INT4 := ${lang_id}; `+
  `BEGIN `+
  `IF (( aname = '' ) and (adesc = '') ) THEN `+ //если пустое, удаляем
  `    begin DELETE FROM nucl.${table_name}_nls WHERE ${table_name}_id = ${table_id} and lang_id = alang_id; end; `+
  `ELSE `+
  `     begin `+ //если не пустое, добавляем или апдейтим
  `       INSERT INTO nucl.${table_name}_nls (name, ${descr_field_name}, ${table_name}_id, lang_id) VALUES (aname, adesc, a${table_name}_id, alang_id) `+ 
  `       ON CONFLICT (${table_name}_id, lang_id) do UPDATE SET name = aname, ${descr_field_name}=adesc; `+ 
  `     end; `+
  `END IF; `+
  `END; `+
  `$$ `;
  return sql_nls;
}

const getNLSQueryNoDescr = (name, table_id, lang_id, table_name) => 
{
  const sql_nls = `DO $$ `+
  `declare aname VARCHAR := '${name}'; `+
  `declare a${table_name}_id INT4 := ${table_id}; `+
  `declare alang_id INT4 := ${lang_id}; `+
  `BEGIN `+
  `IF ( aname = '' )  THEN `+ //если пустое, удаляем
  `    begin DELETE FROM nucl.${table_name}_nls WHERE ${table_name}_id = ${table_id} and lang_id = alang_id; end; `+
  `ELSE `+
  `     begin `+ //если не пустое, добавляем или апдейтим
  `       INSERT INTO nucl.${table_name}_nls (name, ${table_name}_id, lang_id) VALUES (aname, a${table_name}_id, alang_id) `+ 
  `       ON CONFLICT (${table_name}_id, lang_id) do UPDATE SET name = aname; `+ 
  `     end; `+
  `END IF; `+
  `END; `+
  `$$ `;
  return sql_nls;
}

const getNLSQueryRadType = (name, descr, table_code, lang_id) => 
{
  var descr_field_name = 'descr';

  const sql_nls = `DO $$  
    declare aname VARCHAR := '${name}'; 
    declare adesc text := '${descr}';  
    declare aradtype_code bpchar(1) := '${table_code}'; 
    declare alang_id INT4 := ${lang_id};  
    BEGIN 
    IF (( aname = '' ) and (adesc = '') ) THEN  
        begin DELETE FROM nucl.radiation_type_nls WHERE rad_type_code = '${table_code}' and lang_id = alang_id; end; 
    ELSE  
        begin  
          INSERT INTO nucl.radiation_type_nls (name, descr, rad_type_code, lang_id) VALUES (aname, adesc, aradtype_code, alang_id)  
          ON CONFLICT (rad_type_code, lang_id) do UPDATE SET name = aname, descr=adesc;  
        end;  
    END IF; 
    END;  
    $$ `;

  console.log(sql_nls);
  return sql_nls;
}


module.exports = {
    getNLSQuery,
    getNLSQueryNoDescr,
    getNLSQueryRadType
  }
  