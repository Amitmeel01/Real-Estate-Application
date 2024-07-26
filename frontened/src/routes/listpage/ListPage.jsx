import React, { Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';
import Filter from '../../components/filter/Filter';
import './ListPage.scss';
import Card from '../../components/card/Card';
import Map from '../../components/map/Map';

function ListPage() {
  const data = useLoaderData();

  return (
    <div className='listPage'>
      <div className='listContainer'>
        <div className='wrapper'>
          <Filter />
          <Suspense fallback={<p>Loading posts...</p>}>
            <Await resolve={data.postResponse}>
              {(postResponse) => (
                <>
                  {postResponse.data.map((post) => (
                    <Card key={post.id} item={post} />
                  ))}
                </>
              )}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className='mapContainer'>
        <Suspense fallback={<p>Loading map...</p>}>
          <Await resolve={data.postResponse}>
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
