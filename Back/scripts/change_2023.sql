-- Новые колонки в nucl.agegroup
alter TABLE nucl.agegroup add column resp_rate_day numeric;
alter TABLE nucl.agegroup add column resp_rate_night numeric;
COMMENT ON COLUMN nucl.agegroup.resp_rate_day
    IS 'Скорость дыхания днём, куб.м/сек';
COMMENT ON COLUMN nucl.agegroup.resp_rate_night
    IS 'Скорость дыхания ночью, куб.м/сек';	
	
update  nucl.agegroup set resp_rate_day=3.17e-05, resp_rate_night=3.17e-05 where id=61;	
update  nucl.agegroup set resp_rate_day=9.7e-05, resp_rate_night=4.2e-05 where id=62;
update  nucl.agegroup set resp_rate_day=0.00016, resp_rate_night=6.7e-05where id=63;
update  nucl.agegroup set resp_rate_day=0.00031, resp_rate_night=8.6e-05 where id=64;
update  nucl.agegroup set resp_rate_day=0.00038, resp_rate_night=0.00012 where id=65;
update  nucl.agegroup set resp_rate_day=0.00041, resp_rate_night=0.00013 where id=66;

alter TABLE nucl.agegroup alter column resp_rate_day set not null;
alter TABLE nucl.agegroup alter column resp_rate_night set not null;

-- Колонки ext_cloud, ext_ground возможно будут удалены позднее, не используйте их в интерфейсе
----------------------------

delete 	FROM nucl.data_source where id=4574; -- удалён источник RPK-V, был пустой

------------------
-- Новые дозовые коэффициенты для кожи, позднее в data_source_id=1 будут загружены данные из NuclidesDB_ICRP38.sqlite, вместо старых
INSERT INTO nucl.dose_ratio(id, title, physparam_id, dr_type)	VALUES (10, 'hS_Ep', 39, 'e') returning id;	
INSERT INTO nucl.dose_ratio_nls(id, dose_ratio_id, name, fullname, lang_id)	VALUES (12, 10, 
'Мощность эфф. дозы внешнего фотонного облучения на единицу поверхностной плотности загрязнения кожи',
'Мощность эффективной дозы внешнего облучения на кожу в результате поверхностного загрязнения кожи нуклидом единичной плотности, испускающим фотоны', 1);
INSERT INTO nucl.dose_ratio(id, title, physparam_id, dr_type)	VALUES (11, 'hS_Ee', 39, 'e') returning id;	
INSERT INTO nucl.dose_ratio_nls(id, dose_ratio_id, name, fullname, lang_id)	VALUES (13, 11, 
'Мощность эфф. дозы внешнего облучения электронами на ед. поверхностной плотности загрязнения кожи',
'Мощность эффективной дозы внешнего облучения на кожу в результате поверхностного загрязнения кожи нуклидом единичной плотности, испускающим электроны', 1);

--------------------
-- Дополнительные колонки в nucl.organ, позднее заполню значениями. Выводить или нет в интерфейсе, Вам решать
alter TABLE nucl.organ add column RBEH numeric;
COMMENT ON COLUMN nucl.organ.RBEH  IS 'Множитель для излучения с высокой передачей энергии (_h) для расчета ОБЭ-взвешенных доз';
alter TABLE nucl.organ add column RBEL numeric;
COMMENT ON COLUMN nucl.organ.RBEL  IS 'Множитель для излучения с низкой передачей энергии (_l) для расчета ОБЭ-взвешенных доз';											  
alter TABLE nucl.organ add column RBEH_I numeric;
COMMENT ON COLUMN nucl.organ.RBEH  IS 'Множитель для излучения с высокой передачей энергии (_h) для расчета ОБЭ-взвешенных доз для йодов';
alter TABLE nucl.organ add column RBEL_I numeric;
COMMENT ON COLUMN nucl.organ.RBEL  IS 'Множитель для излучения с низкой передачей энергии (_l) для расчета ОБЭ-взвешенных доз для йодов';	
alter TABLE nucl.organ add column TWF numeric;	

--------------------
-- Для загрузки ДК внешнего облучения от облака (grnd_ ****) и поверхности (air_****) в зависимости от возрастных групп населения, 
-- добавляем колонку agegroup_id в nucl.value_ext_dose и дочерние таблицы, добавляем её в обработчики
alter TABLE nucl.value_ext_dose add column agegroup_id integer;
alter TABLE nucl.value_ext_dose add CONSTRAINT value_ext_dose_ag_fkey FOREIGN KEY (agegroup_id)
        REFERENCES nucl.agegroup (id);
COMMENT ON COLUMN nucl.value_ext_dose.agegroup_id    IS 'Код группы возрастов';		
CREATE INDEX value_ext_dose_ag_idx    ON nucl.value_ext_dose USING btree    (agegroup_id ASC NULLS LAST)    TABLESPACE pg_default;
DROP INDEX nucl.value_ext_dose_uidx;
CREATE UNIQUE INDEX value_ext_dose_uidx
    ON nucl.value_ext_dose USING btree
    (dose_ratio_id, COALESCE(organ_id, '-1'::integer), irradiation_id, isotope_id, people_class_id, COALESCE(agegroup_id, '-1'::integer), data_source_id)
    TABLESPACE pg_default;

alter TABLE doserate.value_ext_dose_1 add CONSTRAINT value_ext_dose_ag_fkey FOREIGN KEY (agegroup_id) REFERENCES nucl.agegroup (id);
COMMENT ON COLUMN doserate.value_ext_dose_1.agegroup_id    IS 'Код группы возрастов';		
CREATE INDEX value_ext_dose_1_ag_idx    ON doserate.value_ext_dose_1 USING btree    (agegroup_id ASC NULLS LAST)    TABLESPACE pg_default;
DROP INDEX doserate.value_ext_dose_1_uidx;
CREATE UNIQUE INDEX value_ext_dose_1_uidx
    ON doserate.value_ext_dose_1 USING btree
    (dose_ratio_id, COALESCE(organ_id, '-1'::integer), irradiation_id, isotope_id, people_class_id, COALESCE(agegroup_id, '-1'::integer), data_source_id)
    TABLESPACE pg_default;
	
	
alter TABLE doserate.value_ext_dose_411 add CONSTRAINT value_ext_dose_ag_fkey FOREIGN KEY (agegroup_id) REFERENCES nucl.agegroup (id);
COMMENT ON COLUMN doserate.value_ext_dose_411.agegroup_id    IS 'Код группы возрастов';		
CREATE INDEX value_ext_dose_411_ag_idx    ON doserate.value_ext_dose_411 USING btree    (agegroup_id ASC NULLS LAST)    TABLESPACE pg_default;
DROP INDEX doserate.value_ext_dose_411_uidx;
CREATE UNIQUE INDEX value_ext_dose_411_uidx
    ON doserate.value_ext_dose_411 USING btree
    (dose_ratio_id, COALESCE(organ_id, '-1'::integer), irradiation_id, isotope_id, people_class_id, COALESCE(agegroup_id, '-1'::integer), data_source_id)
    TABLESPACE pg_default;
	
alter TABLE doserate.value_ext_dose_4575 add CONSTRAINT value_ext_dose_ag_fkey FOREIGN KEY (agegroup_id) REFERENCES nucl.agegroup (id);
COMMENT ON COLUMN doserate.value_ext_dose_4575.agegroup_id    IS 'Код группы возрастов';		
CREATE INDEX value_ext_dose_4575_ag_idx    ON doserate.value_ext_dose_4575 USING btree    (agegroup_id ASC NULLS LAST)    TABLESPACE pg_default;
--DROP INDEX doserate.value_ext_dose_4575_uidx;
CREATE UNIQUE INDEX value_ext_dose_4575_uidx
    ON doserate.value_ext_dose_4575 USING btree
    (dose_ratio_id, COALESCE(organ_id, '-1'::integer), irradiation_id, isotope_id, people_class_id, COALESCE(agegroup_id, '-1'::integer), data_source_id)
    TABLESPACE pg_default;

CREATE OR REPLACE FUNCTION nucl.value_ext_dose_inh()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE

BEGIN

EXECUTE 'INSERT INTO doserate.value_ext_dose_'||cast(NEW.data_source_id as text)||'(id, dose_ratio_id, organ_id, irradiation_id, isotope_id, people_class_id, data_source_id, dr_value, agegroup_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $10)'
USING NEW.id, NEW.dose_ratio_id, NEW.organ_id, NEW.irradiation_id, NEW.isotope_id, NEW.people_class_id, 
            NEW.data_source_id, NEW.dr_value, NEW.agegroup_id;

 RETURN NULL;
END;
$BODY$;

ALTER FUNCTION nucl.value_ext_dose_inh()    OWNER TO sda;	


CREATE OR REPLACE FUNCTION nucl.data_source_inh()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
comm text;
ds character varying;
BEGIN
IF (TG_OP = 'INSERT') THEN

 ds:=cast(NEW.id as character varying);

-- value_int_dose
 EXECUTE 'create table doserate.value_int_dose_'||ds||' (LIKE nucl.value_int_dose INCLUDING CONSTRAINTS INCLUDING INDEXES INCLUDING COMMENTS INCLUDING DEFAULTS)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (aerosol_amad_id) REFERENCES nucl.aerosol_amad (id)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (agegroup_id) REFERENCES nucl.agegroup (id)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (aerosol_sol_id) REFERENCES nucl.aerosol_sol (id)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (chem_comp_gr_id) REFERENCES nucl.chem_comp_gr (id)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (dose_ratio_id) REFERENCES nucl.dose_ratio (id)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (data_source_id) REFERENCES nucl.data_source (id)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (integral_period_id) REFERENCES nucl.integral_period (id)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (irradiation_id) REFERENCES nucl.irradiation (id)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (isotope_id) REFERENCES nucl.isotope (id)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (let_level_id) REFERENCES nucl.let_level (id)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (organ_id) REFERENCES nucl.organ (id)';  
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (people_class_id) REFERENCES nucl.people_class (id)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (exp_scenario_id) REFERENCES nucl.exp_scenario (id)'; 
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD FOREIGN KEY (subst_form_id) REFERENCES nucl.subst_form (id)';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' ADD CHECK (data_source_id = '||ds||')';
 EXECUTE 'ALTER TABLE doserate.value_int_dose_'||ds||' INHERIT nucl.value_int_dose';

-- value_ext_dose
 EXECUTE 'create table doserate.value_ext_dose_'||ds||' (LIKE nucl.value_ext_dose INCLUDING CONSTRAINTS INCLUDING INDEXES INCLUDING COMMENTS INCLUDING DEFAULTS)';
 EXECUTE 'ALTER TABLE doserate.value_ext_dose_'||ds||' ADD FOREIGN KEY (dose_ratio_id) REFERENCES nucl.dose_ratio (id)';
 EXECUTE 'ALTER TABLE doserate.value_ext_dose_'||ds||' ADD FOREIGN KEY (data_source_id) REFERENCES nucl.data_source (id)';
 EXECUTE 'ALTER TABLE doserate.value_ext_dose_'||ds||' ADD FOREIGN KEY (isotope_id) REFERENCES nucl.isotope (id)';
 EXECUTE 'ALTER TABLE doserate.value_ext_dose_'||ds||' ADD FOREIGN KEY (irradiation_id) REFERENCES nucl.irradiation (id)';
 EXECUTE 'ALTER TABLE doserate.value_ext_dose_'||ds||' ADD FOREIGN KEY (organ_id) REFERENCES nucl.organ (id)'; 
 EXECUTE 'ALTER TABLE doserate.value_ext_dose_'||ds||' ADD FOREIGN KEY (people_class_id) REFERENCES nucl.people_class (id)';
 EXECUTE 'ALTER TABLE doserate.value_ext_dose_'||ds||' ADD FOREIGN KEY (agegroup_id) REFERENCES nucl.agegroup (id)';
 EXECUTE 'ALTER TABLE doserate.value_ext_dose_'||ds||' ADD CHECK (data_source_id = '||ds||')';
 EXECUTE 'ALTER TABLE doserate.value_ext_dose_'||ds||' INHERIT nucl.value_ext_dose';
 
-- value_ratio_git
 EXECUTE 'create table doserate.value_ratio_git_'||ds||' (LIKE nucl.value_ratio_git INCLUDING CONSTRAINTS INCLUDING INDEXES INCLUDING COMMENTS INCLUDING DEFAULTS)';
 EXECUTE 'ALTER TABLE doserate.value_ratio_git_'||ds||' ADD FOREIGN KEY (agegroup_id) REFERENCES nucl.agegroup (id)';
 EXECUTE 'ALTER TABLE doserate.value_ratio_git_'||ds||' ADD FOREIGN KEY (aerosol_sol_id) REFERENCES nucl.aerosol_sol (id)';
 EXECUTE 'ALTER TABLE doserate.value_ratio_git_'||ds||' ADD FOREIGN KEY (chelement_id) REFERENCES nucl.chelement (id)';
 EXECUTE 'ALTER TABLE doserate.value_ratio_git_'||ds||' ADD FOREIGN KEY (dose_ratio_id) REFERENCES nucl.dose_ratio (id)';
 EXECUTE 'ALTER TABLE doserate.value_ratio_git_'||ds||' ADD FOREIGN KEY (data_source_id) REFERENCES nucl.data_source (id)';
 EXECUTE 'ALTER TABLE doserate.value_ratio_git_'||ds||' ADD FOREIGN KEY (chem_comp_gr_id) REFERENCES nucl.chem_comp_gr (id)';
 EXECUTE 'ALTER TABLE doserate.value_ratio_git_'||ds||' ADD FOREIGN KEY (irradiation_id) REFERENCES nucl.irradiation (id)';
 EXECUTE 'ALTER TABLE doserate.value_ratio_git_'||ds||' ADD FOREIGN KEY (people_class_id) REFERENCES nucl.people_class (id)';
 EXECUTE 'ALTER TABLE doserate.value_ratio_git_'||ds||' ADD FOREIGN KEY (subst_form_id) REFERENCES nucl.subst_form (id)';
 EXECUTE 'ALTER TABLE doserate.value_ratio_git_'||ds||' ADD CHECK (data_source_id = '||ds||')';
 EXECUTE 'ALTER TABLE doserate.value_ratio_git_'||ds||' INHERIT nucl.value_ratio_git';

 

ELSIF (TG_OP = 'DELETE')
 THEN
  ds:=cast(OLD.id as character varying);
  EXECUTE 'drop table doserate.value_int_dose_'||ds;  
  EXECUTE 'drop table doserate.value_ext_dose_'||ds;  
  EXECUTE 'drop table doserate.value_ratio_git_'||ds;  
  RETURN OLD;

ELSIF (TG_OP = 'UPDATE') and NEW.id<>OLD.id
 THEN
  raise exception 'data_source.id not available for change'; 

END IF;

 RETURN NEW;
END;
$BODY$;

ALTER FUNCTION nucl.data_source_inh()    OWNER TO sda;

-- На данный момент ДК от облака и поверхности для взрослых равны старым ДК (без возрастной группы), для остальных групп получены умножением на коэффициент
-- После выхода новой публикации будут загружены новые данные.
	
update doserate.value_ext_dose_1 set agegroup_id=66 where irradiation_id = ANY (ARRAY[0, 1]) and people_class_id = 1;	-- 39840
INSERT INTO doserate.value_ext_dose_1(
	dose_ratio_id, organ_id, irradiation_id, isotope_id, people_class_id, agegroup_id, data_source_id, dr_value)
         SELECT v.dose_ratio_id,
            v.organ_id,
            v.irradiation_id,
            v.isotope_id,
            v.people_class_id,
            a.id AS agegroup_id,
            v.data_source_id,
                CASE
                    WHEN v.irradiation_id = 0 AND v.people_class_id = 1 THEN v.dr_value * a.ext_cloud
                    WHEN v.irradiation_id = 1 AND v.people_class_id = 1 THEN v.dr_value * a.ext_ground
                END AS dr_value
           FROM doserate.value_ext_dose_1 v
		    LEFT JOIN nucl.agegroup a ON a.id<>66
          WHERE v.irradiation_id = ANY (ARRAY[0, 1]) and v.people_class_id = 1; 
		  
-- View nucl.value_ext_dose_v используется в RELTRAN

CREATE OR REPLACE VIEW nucl.value_ext_dose_v
 AS
 WITH ext_dose_skin AS (
         SELECT r.id AS dose_ratio_id,
                CASE
                    WHEN r.title::text = 'hS_DT'::text THEN d.organ_id
                    ELSE NULL::integer
                END AS organ_id,
            d.irradiation_id,
            d.isotope_id,
            p.id AS people_class_id,
	            CASE
                    WHEN p.title::text = 'public'::text THEN a.id
                    ELSE NULL::integer
                END AS agegroup_id,
            d.data_source_id,
            d.dr_value,
            d.updatetime
           FROM doserate.value_ext_dose_1 d
             LEFT JOIN nucl.people_class p ON p.title::text = ANY (ARRAY['public'::character varying::text, 'worker'::character varying::text])
             LEFT JOIN nucl.dose_ratio r ON r.title::text = ANY (ARRAY['hS_DT'::character varying::text, 'hS_E'::character varying::text])
             LEFT JOIN nucl.agegroup a ON p.title::text = 'public' --true -- убрать для worker
          WHERE d.dose_ratio_id = 9 AND d.irradiation_id = 19 AND d.organ_id = 45 AND d.people_class_id = 1
        ), 
		ext_dose_cloud_land AS (
         SELECT dose_ratio_id, organ_id, irradiation_id, isotope_id, people_class_id, agegroup_id, data_source_id, dr_value, updatetime
		 FROM doserate.value_ext_dose_1 
		 WHERE irradiation_id = ANY (ARRAY[0, 1])
        ), 
		ext_dose_cloud_land_worker AS (
         SELECT dose_ratio_id, organ_id, irradiation_id, isotope_id, 2, null, data_source_id, dr_value, updatetime
		 FROM doserate.value_ext_dose_1 
		 WHERE irradiation_id = ANY (ARRAY[0, 1]) and people_class_id=1 and agegroup_id=66 
        ), 
		ext_dose_resusp AS (
         SELECT v.dose_ratio_id,
            v.organ_id,
            21 AS irradiation_id,
            v.isotope_id,
            v.people_class_id,
            v.agegroup_id,
            v.data_source_id,
            v.dr_value,
            v.updatetime
           FROM ext_dose_cloud_land v
          WHERE v.irradiation_id = 0
        )
 SELECT ext_dose_cloud_land.dose_ratio_id,
    ext_dose_cloud_land.organ_id,
    ext_dose_cloud_land.irradiation_id,
    ext_dose_cloud_land.isotope_id,
    ext_dose_cloud_land.people_class_id,
    ext_dose_cloud_land.agegroup_id,
    ext_dose_cloud_land.data_source_id,
    ext_dose_cloud_land.dr_value,
    ext_dose_cloud_land.updatetime
   FROM ext_dose_cloud_land
UNION ALL
 SELECT ext_dose_resusp.dose_ratio_id,
    ext_dose_resusp.organ_id,
    ext_dose_resusp.irradiation_id,
    ext_dose_resusp.isotope_id,
    ext_dose_resusp.people_class_id,
    ext_dose_resusp.agegroup_id,
    ext_dose_resusp.data_source_id,
    ext_dose_resusp.dr_value,
    ext_dose_resusp.updatetime
   FROM ext_dose_resusp
UNION ALL
 SELECT ext_dose_skin.dose_ratio_id,
    ext_dose_skin.organ_id,
    ext_dose_skin.irradiation_id,
    ext_dose_skin.isotope_id,
    ext_dose_skin.people_class_id,
    ext_dose_skin.agegroup_id,
    ext_dose_skin.data_source_id,
    ext_dose_skin.dr_value,
    ext_dose_skin.updatetime
   FROM ext_dose_skin;

ALTER TABLE nucl.value_ext_dose_v
    OWNER TO sda;

GRANT ALL ON TABLE nucl.value_ext_dose_v TO sda;
GRANT SELECT ON TABLE nucl.value_ext_dose_v TO rpkv;

		  

REFRESH MATERIALIZED VIEW nucl.dose_ratio_attr_mv;

-- Вам придётся изменить своё MATERIALIZED VIEW с учётом нового атрибута, а не только обновить

------------------------------------------------------------
-- Будут ещё изменения для внутреннего облучения для учёта зависимости дозовых к-тов внутреннего облучения от ингаляции от аэродинамического размера (AD).
-- К этому смогу вернуться через 1 - 2 недели.



COMMENT ON COLUMN nucl.organ.TWF  IS 'Множитель для расчета эффективной дозы';   