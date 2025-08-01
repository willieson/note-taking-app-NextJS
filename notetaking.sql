PGDMP  /                    }         
   notetaking    17.5    17.5 Q    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16852 
   notetaking    DATABASE     �   CREATE DATABASE notetaking WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE notetaking;
                     postgres    false            �            1259    16887    cache    TABLE     �   CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);
    DROP TABLE public.cache;
       public         heap r       postgres    false            �            1259    16894    cache_locks    TABLE     �   CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);
    DROP TABLE public.cache_locks;
       public         heap r       postgres    false            �            1259    16963    comments    TABLE     �   CREATE TABLE public.comments (
    id bigint NOT NULL,
    note_id bigint NOT NULL,
    user_id bigint NOT NULL,
    content text NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.comments;
       public         heap r       postgres    false            �            1259    16962    comments_id_seq    SEQUENCE     x   CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.comments_id_seq;
       public               postgres    false    235            �           0    0    comments_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;
          public               postgres    false    234            �            1259    16919    failed_jobs    TABLE     &  CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.failed_jobs;
       public         heap r       postgres    false            �            1259    16918    failed_jobs_id_seq    SEQUENCE     {   CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.failed_jobs_id_seq;
       public               postgres    false    229            �           0    0    failed_jobs_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;
          public               postgres    false    228            �            1259    16911    job_batches    TABLE     d  CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);
    DROP TABLE public.job_batches;
       public         heap r       postgres    false            �            1259    16902    jobs    TABLE     �   CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);
    DROP TABLE public.jobs;
       public         heap r       postgres    false            �            1259    16901    jobs_id_seq    SEQUENCE     t   CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.jobs_id_seq;
       public               postgres    false    226            �           0    0    jobs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;
          public               postgres    false    225            �            1259    16854 
   migrations    TABLE     �   CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);
    DROP TABLE public.migrations;
       public         heap r       postgres    false            �            1259    16853    migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.migrations_id_seq;
       public               postgres    false    218            �           0    0    migrations_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
          public               postgres    false    217            �            1259    16946    note_shares    TABLE     �   CREATE TABLE public.note_shares (
    id bigint NOT NULL,
    note_id bigint NOT NULL,
    shared_to_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.note_shares;
       public         heap r       postgres    false            �            1259    16945    note_shares_id_seq    SEQUENCE     {   CREATE SEQUENCE public.note_shares_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.note_shares_id_seq;
       public               postgres    false    233            �           0    0    note_shares_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.note_shares_id_seq OWNED BY public.note_shares.id;
          public               postgres    false    232            �            1259    16931    notes    TABLE     %  CREATE TABLE public.notes (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    is_public boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.notes;
       public         heap r       postgres    false            �            1259    16930    notes_id_seq    SEQUENCE     u   CREATE SEQUENCE public.notes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.notes_id_seq;
       public               postgres    false    231            �           0    0    notes_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;
          public               postgres    false    230            �            1259    16871    password_reset_tokens    TABLE     �   CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);
 )   DROP TABLE public.password_reset_tokens;
       public         heap r       postgres    false            �            1259    16878    sessions    TABLE     �   CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);
    DROP TABLE public.sessions;
       public         heap r       postgres    false            �            1259    16861    users    TABLE     x  CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16860    users_id_seq    SEQUENCE     u   CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    220            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    219            �            1259    17159    view_public_notes    VIEW     �   CREATE VIEW public.view_public_notes AS
 SELECT notes.id,
    notes.title,
    notes.content,
    users.name
   FROM (public.notes
     JOIN public.users ON ((notes.user_id = users.id)))
  WHERE (notes.is_public = true);
 $   DROP VIEW public.view_public_notes;
       public       v       postgres    false    231    231    231    231    231    220    220            �            1259    17150    view_shared_notes    VIEW     �  CREATE VIEW public.view_shared_notes AS
 SELECT sn.id AS shared_note_id,
    sn.note_id,
    sn.shared_to_id,
    stu.email AS shared_to_email,
    stu.name AS shared_to_name,
    n.user_id AS shared_by_user_id,
    sbu.name AS shared_by_name,
    sbu.email AS shared_by_email,
    n.title,
    n.content
   FROM (((public.note_shares sn
     JOIN public.notes n ON ((sn.note_id = n.id)))
     JOIN public.users stu ON ((sn.shared_to_id = stu.id)))
     JOIN public.users sbu ON ((n.user_id = sbu.id)));
 $   DROP VIEW public.view_shared_notes;
       public       v       postgres    false    220    220    220    231    231    231    231    233    233    233            �            1259    17146    view_user_notes    VIEW       CREATE VIEW public.view_user_notes AS
 SELECT n.id AS note_id,
    n.user_id,
    u.email AS user_email,
    u.name AS user_name,
    n.title,
    n.content,
    n.created_at,
    n.updated_at
   FROM (public.notes n
     JOIN public.users u ON ((n.user_id = u.id)));
 "   DROP VIEW public.view_user_notes;
       public       v       postgres    false    231    231    231    220    220    220    231    231    231            �           2604    16966    comments id    DEFAULT     j   ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);
 :   ALTER TABLE public.comments ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    235    234    235            �           2604    16922    failed_jobs id    DEFAULT     p   ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);
 =   ALTER TABLE public.failed_jobs ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    229    228    229            �           2604    16905    jobs id    DEFAULT     b   ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);
 6   ALTER TABLE public.jobs ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    226    226            �           2604    16857    migrations id    DEFAULT     n   ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
 <   ALTER TABLE public.migrations ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218            �           2604    16949    note_shares id    DEFAULT     p   ALTER TABLE ONLY public.note_shares ALTER COLUMN id SET DEFAULT nextval('public.note_shares_id_seq'::regclass);
 =   ALTER TABLE public.note_shares ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    232    233    233            �           2604    16934    notes id    DEFAULT     d   ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);
 7   ALTER TABLE public.notes ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    231    230    231            �           2604    16864    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            �          0    16887    cache 
   TABLE DATA           7   COPY public.cache (key, value, expiration) FROM stdin;
    public               postgres    false    223   lb       �          0    16894    cache_locks 
   TABLE DATA           =   COPY public.cache_locks (key, owner, expiration) FROM stdin;
    public               postgres    false    224   �b       �          0    16963    comments 
   TABLE DATA           Y   COPY public.comments (id, note_id, user_id, content, created_at, updated_at) FROM stdin;
    public               postgres    false    235   �b       �          0    16919    failed_jobs 
   TABLE DATA           a   COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
    public               postgres    false    229   �c       �          0    16911    job_batches 
   TABLE DATA           �   COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
    public               postgres    false    227   �c       �          0    16902    jobs 
   TABLE DATA           c   COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
    public               postgres    false    226   �c       �          0    16854 
   migrations 
   TABLE DATA           :   COPY public.migrations (id, migration, batch) FROM stdin;
    public               postgres    false    218   �c       �          0    16946    note_shares 
   TABLE DATA           X   COPY public.note_shares (id, note_id, shared_to_id, created_at, updated_at) FROM stdin;
    public               postgres    false    233   pd       �          0    16931    notes 
   TABLE DATA           _   COPY public.notes (id, user_id, title, content, is_public, created_at, updated_at) FROM stdin;
    public               postgres    false    231   �d       �          0    16871    password_reset_tokens 
   TABLE DATA           I   COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
    public               postgres    false    221   �e       �          0    16878    sessions 
   TABLE DATA           _   COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
    public               postgres    false    222   �e       �          0    16861    users 
   TABLE DATA           u   COPY public.users (id, name, email, email_verified_at, password, remember_token, created_at, updated_at) FROM stdin;
    public               postgres    false    220   h       �           0    0    comments_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.comments_id_seq', 10, true);
          public               postgres    false    234            �           0    0    failed_jobs_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);
          public               postgres    false    228            �           0    0    jobs_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);
          public               postgres    false    225            �           0    0    migrations_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.migrations_id_seq', 6, true);
          public               postgres    false    217            �           0    0    note_shares_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.note_shares_id_seq', 16, true);
          public               postgres    false    232            �           0    0    notes_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.notes_id_seq', 16, true);
          public               postgres    false    230            �           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 17, true);
          public               postgres    false    219            �           2606    16900    cache_locks cache_locks_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);
 F   ALTER TABLE ONLY public.cache_locks DROP CONSTRAINT cache_locks_pkey;
       public                 postgres    false    224            �           2606    16893    cache cache_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);
 :   ALTER TABLE ONLY public.cache DROP CONSTRAINT cache_pkey;
       public                 postgres    false    223            �           2606    16970    comments comments_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_pkey;
       public                 postgres    false    235            �           2606    16927    failed_jobs failed_jobs_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.failed_jobs DROP CONSTRAINT failed_jobs_pkey;
       public                 postgres    false    229            �           2606    16929 #   failed_jobs failed_jobs_uuid_unique 
   CONSTRAINT     ^   ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);
 M   ALTER TABLE ONLY public.failed_jobs DROP CONSTRAINT failed_jobs_uuid_unique;
       public                 postgres    false    229            �           2606    16917    job_batches job_batches_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.job_batches DROP CONSTRAINT job_batches_pkey;
       public                 postgres    false    227            �           2606    16909    jobs jobs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.jobs DROP CONSTRAINT jobs_pkey;
       public                 postgres    false    226            �           2606    16859    migrations migrations_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.migrations DROP CONSTRAINT migrations_pkey;
       public                 postgres    false    218            �           2606    16951    note_shares note_shares_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.note_shares
    ADD CONSTRAINT note_shares_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.note_shares DROP CONSTRAINT note_shares_pkey;
       public                 postgres    false    233            �           2606    16939    notes notes_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.notes DROP CONSTRAINT notes_pkey;
       public                 postgres    false    231            �           2606    16877 0   password_reset_tokens password_reset_tokens_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);
 Z   ALTER TABLE ONLY public.password_reset_tokens DROP CONSTRAINT password_reset_tokens_pkey;
       public                 postgres    false    221            �           2606    16884    sessions sessions_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_pkey;
       public                 postgres    false    222            �           2606    16870    users users_email_unique 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_unique;
       public                 postgres    false    220            �           2606    16868    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    220            �           1259    16910    jobs_queue_index    INDEX     B   CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);
 $   DROP INDEX public.jobs_queue_index;
       public                 postgres    false    226            �           1259    16886    sessions_last_activity_index    INDEX     Z   CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);
 0   DROP INDEX public.sessions_last_activity_index;
       public                 postgres    false    222            �           1259    16885    sessions_user_id_index    INDEX     N   CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);
 *   DROP INDEX public.sessions_user_id_index;
       public                 postgres    false    222            �           2606    16971 !   comments comments_note_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_note_id_foreign FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_note_id_foreign;
       public               postgres    false    231    235    4839            �           2606    16976 !   comments comments_user_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.comments DROP CONSTRAINT comments_user_id_foreign;
       public               postgres    false    4818    235    220            �           2606    16952 '   note_shares note_shares_note_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.note_shares
    ADD CONSTRAINT note_shares_note_id_foreign FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.note_shares DROP CONSTRAINT note_shares_note_id_foreign;
       public               postgres    false    4839    233    231            �           2606    16957 ,   note_shares note_shares_shared_to_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.note_shares
    ADD CONSTRAINT note_shares_shared_to_id_foreign FOREIGN KEY (shared_to_id) REFERENCES public.users(id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.note_shares DROP CONSTRAINT note_shares_shared_to_id_foreign;
       public               postgres    false    233    220    4818            �           2606    16940    notes notes_user_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.notes DROP CONSTRAINT notes_user_id_foreign;
       public               postgres    false    220    231    4818            �   R   x��I,J,K��MNL�H�����wH��M�K�K�ϭ142�3 BC�����"�L+CsScc3#S#skN�+�8c@������ �%�      �      x������ � �      �   �   x�m�Q�0���� f�Ƅ��e ��o��������7e��`�!. �,q.�&V��U����.��~��u�\�`��Ӽ����Ɩ�H>>����֝?�b��B>��e�}��)��Cl�֖��!����w�.�Bh�������"�H�=      �      x������ � �      �      x������ � �      �      x������ � �      �   r   x�e��
� ��k�0�ͬ�	�� ���?���ù��� "��s����gMY�5��Ta�a���
�8>��0��[!&���-���}��7�<���݇[��!��n�C �L       �   Q   x�m���0��3E(������*$~>ۄ�S���Z+�l�a�Pq|�Q�S�T�<���oh�W}m���D�Y7�      �   �   x�m�In�0E��)x���)ڹ�t@{�l(ۉGR`�@�_�F�(4 "?�'�A��&硥�W�3�L��:��2�h����P ���M�"�����WL��2*��h	�J�-�^�sx_�͵��郷�A����>��<�a�-{\�ͧ�	��o<���D{�T���j� t����%?���`�ӌc���b��Of�����ӫ��)�q�����/x6�>j�27JY�.��q�w��A�}ge�      �      x������ � �      �     x���ˎ�0���S�l73��"ո!�n���h�⧯�TUW���l��9>���MFɒ��u#Y����+o��o�0I���a{x�}�f ��X`��)}}Td�ST6�$�H@�O��œ4]�����g�~�[�e ��M��V������8>7��PC��@���s�dd���EJZ�A�y�O���E�Y+di����b�8�UAY*���*��2ߺ��蹈Q���!�_=.<�wc����Ҝ����J�z1N��̮ι�Ӱ�����i^����$���n������޵�Ѐ��?UZ\]�8��2��g@W���.�2�p?*�C|U�;�b.A1A�9����.����8����'��rb� z�0pO�������S�c؍��'	�� !,&�H4����@�MU���_�3{w������.T~k��7��_(�����&Y���9��#V
��%��[!�V��7�s.iӊ,�͗N�r�#M�O6��J�Ǎ����;]E�K�ο?����p�      �   .  x�}��ҢJ���w�o�ytue��� �   ���W����FTeV��|df�y��I	U_�e�t���s�%��ـ>��'>�Ny�H�����	Ve+M&&�5Ūv�n�x4\�x�PD���d��{#�O�������/p��� ��C�*Z��^��hEb�}��aUT���Go��$����l]�������"ALB������\��#��:?��\�->���t!�ٽ����V	�I�:���bP삤ALAIQ������}�'�1$_P}ԪÆ�J�zu�r�����|�eK<ŭ��8���؛��������=���r����x�v��I5/���oȑ��d5_��Pa;{���r
��Y�w��zŶѼ;���}9���!8mH���I�)d*����N�mp�~�g�0Ά��;-X!�WҶ\��Xn�K���>��D"e/p;5�����Z�y��é�,8(���Y|G��Ρ���$:���ٙtNS(��A7DL�^��djƝ����Ѳ)�} �N.0�����kB8s��PO�t�M��=#1J8%�3��t:�bD���ĕ���@P��`�j�}�@����z�Hz���W��h�QЭ�j�	��
(f��uC�'P1 �������@�$�R����������!�~�gp3X�Awm������`�  vA� �	(l���"�A��m��"~k��Q����^�9"��f&V�^8�VZIՉH�kW�pl��ϟi0NBa�|�_Hp4:)7[_v�8�c����L�)՞�s��	�F�r)k��{.���6�H��m
���_�&�T��3��hp�	�ɏ�a��xg�����Յ3�sy��'��:�� QP����4y�j�;)�u-�r�?fA(�AR����~�K\�ҵ`�(vW9inž��?)�� ~6)l��D$a0pZB��$��T�Ÿ� �z�:g��}?���]T�9��9�<5&��wf��� i0�BїJD��
e�Xї.'L������sZg:E�,��Ş�9Y)�:)�?����N�V�     